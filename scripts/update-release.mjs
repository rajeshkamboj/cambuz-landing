#!/usr/bin/env node
/**
 * Point the landing site at a different release of Cambuz PDF Reader.
 *
 *   node scripts/update-release.mjs v1.1.0     # rewrite the tag in src/config/site.ts
 *   node scripts/update-release.mjs --check    # verify the current tag's assets
 *   node scripts/update-release.mjs --check v1.1.0
 *
 * The site has exactly one place that decides which release every download link
 * points at: RELEASE_TAG in src/config/site.ts. This script rewrites that tag
 * (and the product version that goes with it) and can verify against the GitHub
 * Releases API that the files the site promises actually exist, with the sizes
 * the site claims.
 *
 * The tag is never "latest": GitHub excludes pre-releases from /releases/latest,
 * which is why the tag is pinned everywhere.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE_CONFIG = join(REPO_ROOT, 'src', 'config', 'site.ts');
const REPO_SLUG = 'rajeshkamboj/cambuz-pdf';

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const tagArgument = args.find((arg) => !arg.startsWith('--'));

const TAG_PATTERN = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** v1.1.0-rc1 → 1.1.0 */
function versionFromTag(tag) {
  return tag.replace(/^v/, '').replace(/-.*$/, '');
}

function fail(message) {
  console.error(`update-release: ${message}`);
  process.exit(1);
}

async function readSiteConfig() {
  try {
    return await readFile(SITE_CONFIG, 'utf8');
  } catch {
    return fail(`cannot read ${SITE_CONFIG}`);
  }
}

function currentTag(source) {
  const match = source.match(/const RELEASE_TAG = '([^']+)'/);
  if (!match) fail("could not find RELEASE_TAG in src/config/site.ts");
  return match[1];
}

/** File names + byte sizes the site advertises, read straight from site.ts. */
function advertisedArtifacts(source) {
  const artifacts = [];
  const blocks = source.split(/\n  \{/).slice(1);
  for (const block of blocks) {
    const fileName = block.match(/fileName: '([^']+)'/);
    const bytes = block.match(/bytes: (\d+)/);
    if (fileName) {
      artifacts.push({
        fileName: fileName[1],
        bytes: bytes ? Number(bytes[1]) : null,
      });
    }
  }
  return artifacts;
}

async function fetchRelease(tag) {
  const url = `https://api.github.com/repos/${REPO_SLUG}/releases/tags/${tag}`;
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'cambuz-landing-update-release',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let response;
  try {
    response = await fetch(url, { headers });
  } catch (error) {
    fail(`could not reach api.github.com: ${error.message}`);
  }

  if (response.status === 404) {
    fail(`no release found for tag ${tag} in ${REPO_SLUG}`);
  }
  if (!response.ok) {
    fail(`GitHub API returned ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function printRelease(release) {
  const kind = release.prerelease ? 'pre-release' : 'release';
  console.log(`\n${release.tag_name} (${kind}, published ${release.published_at})`);
  console.log(`${release.html_url}\n`);
  console.log(`${'file'.padEnd(52)} ${'bytes'.padStart(12)}  MiB`);
  for (const asset of release.assets) {
    console.log(
      `${asset.name.padEnd(52)} ${String(asset.size).padStart(12)}  ${(
        asset.size /
        (1024 * 1024)
      ).toFixed(1)}`
    );
  }
}

function compare(release, advertised) {
  const byName = new Map(release.assets.map((asset) => [asset.name, asset]));
  const problems = [];

  for (const artifact of advertised) {
    const asset = byName.get(artifact.fileName);
    if (!asset) {
      problems.push(`missing from the release: ${artifact.fileName}`);
      continue;
    }
    if (artifact.bytes !== null && artifact.bytes !== asset.size) {
      problems.push(
        `size mismatch for ${artifact.fileName}: site says ${artifact.bytes}, release says ${asset.size}`
      );
    }
  }

  const advertisedNames = new Set(advertised.map((artifact) => artifact.fileName));
  const checksums = release.assets.find((asset) => asset.name === 'SHA256SUMS.txt');
  if (!checksums) {
    problems.push('the release has no SHA256SUMS.txt to verify against');
  }
  for (const asset of release.assets) {
    if (asset.name !== 'SHA256SUMS.txt' && !advertisedNames.has(asset.name)) {
      console.log(`note: the release also has ${asset.name}, not linked from the site`);
    }
  }

  if (problems.length > 0) {
    console.error('\nFAILED:');
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log(
    `\nOK: all ${advertised.length} advertised files exist with matching sizes.`
  );
}

async function main() {
  const source = await readSiteConfig();
  const tag = tagArgument ?? currentTag(source);

  if (!TAG_PATTERN.test(tag)) {
    fail(`"${tag}" is not a release tag like v1.1.0 or v1.1.0-rc1`);
  }

  if (tagArgument && !checkOnly) {
    const version = versionFromTag(tag);
    const updated = source
      .replace(/(const RELEASE_TAG = ')[^']+(')/, `$1${tag}$2`)
      .replace(/(const RELEASE_VERSION = ')[^']+(')/, `$1${version}$2`);

    if (updated === source) {
      console.log(`src/config/site.ts already points at ${tag}; nothing to write.`);
    } else {
      await writeFile(SITE_CONFIG, updated);
      console.log(`src/config/site.ts now points at ${tag} (version ${version}).`);
      console.log(
        'Re-check the byte sizes and SHA-256 values in src/config/site.ts against\n' +
          'the release — the script does not guess them.'
      );
    }
  }

  const release = await fetchRelease(tag);
  printRelease(release);
  compare(release, advertisedArtifacts(source));
}

main().catch((error) => fail(error.stack ?? String(error)));
