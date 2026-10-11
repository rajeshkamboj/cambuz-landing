#!/usr/bin/env node
/**
 * Synchronise the public Cambuz release metadata into this static site.
 *
 * This script is intentionally driven by a *published, named* release rather
 * than /releases/latest: GitHub does not regard pre-releases as "latest", and
 * an unpinned URL would make the site impossible to audit.
 *
 * Usage:
 *   node scripts/sync-cambuz-release.mjs --tag v1.1.0-build.42 --ref <app-commit>
 *   node scripts/sync-cambuz-release.mjs --discover
 *
 * The upstream app owns docs/landing-content.json. It is a small, reviewed
 * product-content manifest that supplies feature-page text and the release
 * notes path. This script gets checksums and byte counts only from GitHub's
 * Releases API, never by estimating or downloading a binary.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const APP_REPOSITORY = 'rajeshkamboj/cambuz-pdf';
const API_ROOT = `https://api.github.com/repos/${APP_REPOSITORY}`;
const RELEASE_OUTPUT = join(ROOT, 'src', 'config', 'release.generated.ts');
const FEATURES_OUTPUT = join(ROOT, 'src', 'data', 'features.generated.ts');

const artifactDefinitions = [
  { key: 'winX64Setup', suffix: '-win-x64-setup.exe' },
  { key: 'winX64Portable', suffix: '-win-x64-portable.exe' },
  { key: 'linuxX8664AppImage', suffix: '-linux-x86_64.AppImage' },
  { key: 'macArm64Dmg', suffix: '-mac-arm64.dmg' },
  { key: 'macArm64Zip', suffix: '-mac-arm64.zip' },
];

function fail(message) {
  throw new Error(`sync-cambuz-release: ${message}`);
}

function parseArguments(args) {
  const result = { tag: undefined, ref: undefined, discover: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--tag' || argument === '--ref') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) fail(`${argument} requires a value`);
      result[argument.slice(2)] = value;
      index += 1;
    } else if (argument === '--discover') {
      result.discover = true;
    } else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node scripts/sync-cambuz-release.mjs --tag <tag> --ref <commit>');
      console.log('       node scripts/sync-cambuz-release.mjs --discover');
      process.exit(0);
    } else {
      fail(`unknown argument ${argument}`);
    }
  }
  if (result.discover && result.tag) fail('use either --discover or --tag, not both');
  if (!result.discover && !result.tag) fail('pass --tag <tag> or --discover');
  return result;
}

function headers() {
  const result = {
    accept: 'application/vnd.github+json',
    'user-agent': 'cambuz-landing-release-sync',
    'x-github-api-version': '2022-11-28',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) result.authorization = `Bearer ${token}`;
  return result;
}

async function getJson(url) {
  let response;
  try {
    response = await fetch(url, { headers: headers() });
  } catch (error) {
    fail(`could not reach GitHub: ${error.message}`);
  }
  if (!response.ok) {
    const detail = await response.text();
    fail(`GitHub API returned ${response.status} for ${url}: ${detail.slice(0, 240)}`);
  }
  return response.json();
}

function versionFromTag(tag) {
  const match = /^v(\d+\.\d+\.\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(tag);
  if (!match) fail(`"${tag}" is not a supported version tag`);
  return match[1];
}

function digestFor(asset) {
  const match = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest ?? '');
  if (!match) fail(`${asset.name} has no GitHub SHA-256 digest`);
  return match[1].toLowerCase();
}

function releaseArtifact(asset) {
  if (!asset || typeof asset.name !== 'string' || !Number.isSafeInteger(asset.size)) {
    fail('release returned an invalid asset record');
  }
  if (!/^https:\/\/github\.com\/rajeshkamboj\/cambuz-pdf\/releases\/download\//.test(asset.browser_download_url)) {
    fail(`${asset.name} does not have the expected permanent GitHub download URL`);
  }
  return {
    fileName: asset.name,
    url: asset.browser_download_url,
    bytes: asset.size,
    sha256: digestFor(asset),
  };
}

function releaseData(release) {
  if (!release || typeof release.tag_name !== 'string' || !Array.isArray(release.assets)) {
    fail('release response is missing a tag or its assets');
  }
  const version = versionFromTag(release.tag_name);
  const assets = new Map(release.assets.map((asset) => [asset.name, asset]));
  const output = {};

  for (const definition of artifactDefinitions) {
    const matches = release.assets.filter((asset) => asset.name?.endsWith(definition.suffix));
    if (matches.length !== 1) {
      fail(`expected exactly one ${definition.suffix} asset; found ${matches.length}`);
    }
    output[definition.key] = releaseArtifact(matches[0]);
  }

  const checksums = assets.get('SHA256SUMS.txt');
  if (!checksums) fail('release is missing SHA256SUMS.txt');
  output.checksums = releaseArtifact(checksums);

  return {
    tag: release.tag_name,
    version,
    prerelease: Boolean(release.prerelease),
    automaticBuild: /^v\d+\.\d+\.\d+-build\.\d+$/.test(release.tag_name),
    publishedAt: release.published_at,
    sourceCommit: release.target_commitish,
    artifacts: output,
  };
}

function validateString(value, label, { min = 1, max = 600 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max) {
    fail(`${label} must be a ${min}-${max} character string`);
  }
  return value.trim();
}

function validateFeatureManifest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('upstream landing-content.json must be an object');
  }
  if (value.schemaVersion !== 1) fail('upstream manifest must declare schemaVersion 1');
  const releaseNotesPath = validateString(value.releaseNotesPath, 'releaseNotesPath', {
    min: 5,
    max: 180,
  });
  if (!/^[A-Za-z0-9._/-]+\.md$/.test(releaseNotesPath) || releaseNotesPath.includes('..')) {
    fail('releaseNotesPath must be a repository-relative Markdown path');
  }
  if (!Array.isArray(value.features) || value.features.length === 0 || value.features.length > 20) {
    fail('upstream manifest needs between 1 and 20 features');
  }

  const ids = new Set();
  const features = value.features.map((feature, index) => {
    if (!feature || typeof feature !== 'object' || Array.isArray(feature)) {
      fail(`features[${index}] must be an object`);
    }
    const id = validateString(feature.id, `features[${index}].id`, { min: 2, max: 48 });
    if (!/^[a-z0-9-]+$/.test(id) || ids.has(id)) fail(`feature id "${id}" is invalid or duplicated`);
    ids.add(id);
    if (!Array.isArray(feature.bullets) || feature.bullets.length < 1 || feature.bullets.length > 8) {
      fail(`features[${index}].bullets needs between 1 and 8 items`);
    }
    const screenshotId = feature.screenshotId === undefined
      ? undefined
      : validateString(feature.screenshotId, `features[${index}].screenshotId`, { min: 2, max: 48 });
    return {
      id,
      headline: validateString(feature.headline, `features[${index}].headline`, { max: 120 }),
      description: validateString(feature.description, `features[${index}].description`, { max: 650 }),
      bullets: feature.bullets.map((bullet, bulletIndex) =>
        validateString(bullet, `features[${index}].bullets[${bulletIndex}]`, { max: 220 })
      ),
      screenshotAlt: validateString(feature.screenshotAlt, `features[${index}].screenshotAlt`, { max: 300 }),
      screenshotCaption: validateString(feature.screenshotCaption, `features[${index}].screenshotCaption`, {
        max: 220,
      }),
      icon: validateString(feature.icon, `features[${index}].icon`, { max: 60 }),
      ...(screenshotId ? { screenshotId } : {}),
    };
  });

  return { releaseNotesPath, features };
}

async function manifestAt(ref) {
  const encodedRef = encodeURIComponent(ref);
  const content = await getJson(`${API_ROOT}/contents/docs/landing-content.json?ref=${encodedRef}`);
  if (!content || content.encoding !== 'base64' || typeof content.content !== 'string') {
    fail('could not read docs/landing-content.json from the app repository');
  }
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(content.content.replace(/\n/g, ''), 'base64').toString('utf8'));
  } catch (error) {
    fail(`docs/landing-content.json is not valid JSON: ${error.message}`);
  }
  return validateFeatureManifest(parsed);
}

function typescriptValue(value) {
  return JSON.stringify(value, null, 2);
}

function releaseModule(data, manifest) {
  const base = `https://github.com/${APP_REPOSITORY}`;
  const output = {
    ...data,
    releaseNotesUrl: `${base}/blob/main/${manifest.releaseNotesPath}`,
  };
  return `/*\n * Generated by scripts/sync-cambuz-release.mjs from the published GitHub\n * Release. Do not edit this file by hand: the sync workflow replaces it after\n * every successful Cambuz app build.\n */\n\nexport const release = ${typescriptValue(output)} as const;\n`;
}

function featuresModule(features) {
  return `/*\n * Generated from cambuz-pdf/docs/landing-content.json by\n * scripts/sync-cambuz-release.mjs. Change feature copy in the app repository,\n * then let the release sync publish it here.\n */\n\nimport type { Feature } from './features';\n\nexport const generatedFeatures = ${typescriptValue(features)} satisfies readonly Feature[];\n`;
}

async function discoverRelease() {
  const releases = await getJson(`${API_ROOT}/releases?per_page=30`);
  const candidate = releases.find(
    (release) =>
      !release.draft &&
      /^v\d+\.\d+\.\d+-build\.\d+$/.test(release.tag_name ?? '') &&
      Array.isArray(release.assets) &&
      release.assets.some((asset) => asset.name === 'SHA256SUMS.txt')
  );
  if (!candidate) fail('no published automatic build release was found');
  return candidate;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const release = options.discover
    ? await discoverRelease()
    : await getJson(`${API_ROOT}/releases/tags/${encodeURIComponent(options.tag)}`);
  const data = releaseData(release);
  const manifest = await manifestAt(options.ref ?? release.target_commitish ?? 'main');

  await Promise.all([
    writeFile(RELEASE_OUTPUT, releaseModule(data, manifest)),
    writeFile(FEATURES_OUTPUT, featuresModule(manifest.features)),
  ]);

  console.log(`Synced ${data.tag} (${data.version}) from ${APP_REPOSITORY}.`);
  console.log(`Verified ${artifactDefinitions.length} installers, SHA256SUMS.txt and ${manifest.features.length} features.`);
}

main().catch((error) => {
  console.error(error.message ?? String(error));
  process.exitCode = 1;
});
