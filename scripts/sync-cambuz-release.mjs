#!/usr/bin/env node
/**
 * Synchronise the public Cambuz release metadata into this static site.
 *
 * One pass publishes two records:
 *
 *   1. `release`        — the complete, audited record of the newest published
 *                         build. Its asset URLs feed every download link on the
 *                         home page and the top of the download page.
 *   2. `releaseHistory` — the older published builds, newest first, so the
 *                         download page can offer previous versions.
 *
 * Both come from GitHub's Releases API; nothing is ever guessed or estimated.
 * The site deliberately never uses `/releases/latest`: automatic builds are
 * pre-releases, which that endpoint skips, and an unpinned URL could not be
 * matched to a published checksum.
 *
 * The script is strict about the newest release and tolerant about older ones.
 * A newest release that is missing an advertised installer fails the run and
 * leaves the site untouched; an older release whose asset naming has changed is
 * skipped with a warning, because it must not block a new build from shipping.
 *
 * Usage:
 *   node scripts/sync-cambuz-release.mjs --tag v1.1.0-build.42 --ref <app-commit>
 *   node scripts/sync-cambuz-release.mjs --discover [--history 12] [--dry-run]
 */

import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** Repository that owns the application, its builds and its release notes. */
export const APP_REPOSITORY = 'rajeshkamboj/cambuz-pdf';
const APP_WEB = `https://github.com/${APP_REPOSITORY}`;
const API_ROOT = `https://api.github.com/repos/${APP_REPOSITORY}`;

const RELEASE_OUTPUT = join(ROOT, 'src', 'config', 'release.generated.ts');
const FEATURES_OUTPUT = join(ROOT, 'src', 'data', 'features.generated.ts');

/** How many older builds the download page offers by default. */
export const DEFAULT_HISTORY_LIMIT = 12;
/** Upper bound, so a mistake in configuration cannot bloat the bundle. */
export const MAX_HISTORY_LIMIT = 50;

/**
 * Every advertised download, identified by the suffix of its asset name. The
 * version number in front of the suffix changes with each release, so matching
 * on the suffix is what keeps this stable across versions.
 */
export const artifactDefinitions = [
  { key: 'winX64Setup', suffix: '-win-x64-setup.exe' },
  { key: 'winX64Portable', suffix: '-win-x64-portable.exe' },
  { key: 'linuxX8664AppImage', suffix: '-linux-x86_64.AppImage' },
  { key: 'macArm64Dmg', suffix: '-mac-arm64.dmg' },
  { key: 'macArm64Zip', suffix: '-mac-arm64.zip' },
];

class SyncError extends Error {}

function fail(message) {
  throw new SyncError(`sync-cambuz-release: ${message}`);
}

function warn(message) {
  const prefix = process.env.GITHUB_ACTIONS === 'true' ? '::warning::' : 'warning: ';
  console.warn(`${prefix}${message}`);
}

/* ------------------------------------------------------------------ *
 * Arguments
 * ------------------------------------------------------------------ */

export function parseArguments(args) {
  const result = {
    tag: undefined,
    ref: undefined,
    discover: false,
    history: DEFAULT_HISTORY_LIMIT,
    dryRun: false,
    force: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--tag' || argument === '--ref' || argument === '--history') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) fail(`${argument} requires a value`);
      if (argument === '--history') {
        const limit = Number(value);
        if (!Number.isInteger(limit) || limit < 0 || limit > MAX_HISTORY_LIMIT) {
          fail(`--history must be an integer between 0 and ${MAX_HISTORY_LIMIT}`);
        }
        result.history = limit;
      } else {
        result[argument.slice(2)] = value;
      }
      index += 1;
    } else if (argument === '--discover') {
      result.discover = true;
    } else if (argument === '--dry-run') {
      result.dryRun = true;
    } else if (argument === '--force') {
      result.force = true;
    } else if (argument === '--help' || argument === '-h') {
      result.help = true;
    } else {
      fail(`unknown argument ${argument}`);
    }
  }

  if (result.discover && result.tag) fail('use either --discover or --tag, not both');
  if (!result.discover && !result.tag && !result.help) fail('pass --tag <tag> or --discover');
  return result;
}

/* ------------------------------------------------------------------ *
 * GitHub access
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * Reading one release
 * ------------------------------------------------------------------ */

export function versionFromTag(tag) {
  const match = /^v(\d+\.\d+\.\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(tag ?? '');
  if (!match) return null;
  return match[1];
}

export function isAutomaticBuildTag(tag) {
  return /^v\d+\.\d+\.\d+-build\.\d+$/.test(tag ?? '');
}

function digestFor(asset) {
  const match = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest ?? '');
  if (!match) fail(`${asset.name} has no GitHub SHA-256 digest`);
  return match[1].toLowerCase();
}

function releaseAsset(asset) {
  if (!asset || typeof asset.name !== 'string' || !Number.isSafeInteger(asset.size)) {
    fail('release returned an invalid asset record');
  }
  if (!new RegExp(`^https://github\\.com/${APP_REPOSITORY}/releases/download/`).test(asset.browser_download_url)) {
    fail(`${asset.name} does not have the expected permanent GitHub download URL`);
  }
  return {
    fileName: asset.name,
    url: asset.browser_download_url,
    bytes: asset.size,
    sha256: digestFor(asset),
  };
}

/**
 * Reads one release into the shape the site consumes.
 *
 * Throws for anything the site must not publish: an unrecognised tag, a missing
 * or duplicated installer, a missing `SHA256SUMS.txt`, an asset without a
 * GitHub-supplied digest, or a download URL that is not a permanent GitHub
 * release URL.
 */
export function releaseData(release) {
  if (!release || typeof release.tag_name !== 'string' || !Array.isArray(release.assets)) {
    fail('release response is missing a tag or its assets');
  }
  const version = versionFromTag(release.tag_name);
  if (!version) fail(`"${release.tag_name}" is not a supported version tag`);

  const assets = new Map(release.assets.map((asset) => [asset.name, asset]));
  const artifacts = {};

  for (const definition of artifactDefinitions) {
    const matches = release.assets.filter((asset) => asset.name?.endsWith(definition.suffix));
    if (matches.length !== 1) {
      fail(
        `${release.tag_name}: expected exactly one ${definition.suffix} asset; found ${matches.length}`
      );
    }
    artifacts[definition.key] = releaseAsset(matches[0]);
  }

  const checksums = assets.get('SHA256SUMS.txt');
  if (!checksums) fail(`${release.tag_name}: release is missing SHA256SUMS.txt`);
  artifacts.checksums = releaseAsset(checksums);

  const target = typeof release.target_commitish === 'string' ? release.target_commitish : '';
  return {
    tag: release.tag_name,
    version,
    prerelease: Boolean(release.prerelease),
    automaticBuild: isAutomaticBuildTag(release.tag_name),
    publishedAt: typeof release.published_at === 'string' ? release.published_at : null,
    // `target_commitish` is the released commit for CI builds, but it is the
    // literal string "main" for tags pushed by hand. Only a real SHA is
    // published, so the site never claims a commit it cannot point at.
    sourceCommit: /^[0-9a-f]{40}$/i.test(target) ? target : null,
    releasePageUrl: `${APP_WEB}/releases/tag/${encodeURIComponent(release.tag_name)}`,
    artifacts,
  };
}

/** `releaseData` for a release that may legitimately be skipped. */
export function tryReleaseData(release) {
  try {
    return { data: releaseData(release) };
  } catch (error) {
    return { error: error instanceof SyncError ? error.message : String(error.message ?? error) };
  }
}

/* ------------------------------------------------------------------ *
 * Choosing the newest release, and everything older
 * ------------------------------------------------------------------ */

function publishedTime(value) {
  const time = Date.parse(value ?? '');
  return Number.isNaN(time) ? null : time;
}

/** Newest first; ties are broken by tag so the output is deterministic. */
export function byPublishedDescending(a, b) {
  const left = publishedTime(a.publishedAt) ?? 0;
  const right = publishedTime(b.publishedAt) ?? 0;
  if (left !== right) return right - left;
  return b.tag.localeCompare(a.tag);
}

/**
 * Every published release the site can serve completely, newest first.
 * Drafts and releases without a full installer set are reported, not published.
 */
export function collectReleases(releases) {
  const candidates = [];
  const skipped = [];

  for (const release of releases) {
    if (!release || release.draft) continue;
    const tag = release.tag_name;
    if (typeof tag !== 'string' || !versionFromTag(tag)) {
      skipped.push({ tag: String(tag ?? '(untitled)'), reason: 'tag is not a Cambuz version' });
      continue;
    }
    const { data, error } = tryReleaseData(release);
    if (error) {
      skipped.push({ tag, reason: error.replace(/^sync-cambuz-release: /, '') });
      continue;
    }
    candidates.push(data);
  }

  return { candidates: candidates.sort(byPublishedDescending), skipped };
}

/** The newest build must be newer than what the site already advertises. */
export function isNewer(candidate, current) {
  const candidateTime = publishedTime(candidate?.publishedAt);
  const currentTime = publishedTime(current?.publishedAt);
  if (candidateTime === null) return false;
  if (currentTime === null) return true;
  return candidateTime > currentTime;
}

/**
 * Refuses to replace the published release with an older one unless the caller
 * says so explicitly. Re-syncing the same tag is always allowed: only the
 * history list and the feature copy may have moved.
 */
export function assertNoDowngrade(latest, previous, force = false) {
  if (!latest || !previous || force) return;
  if (latest.tag === previous.tag) return;
  if (isNewer(latest, previous)) return;
  fail(
    `refusing to replace the published ${previous.tag} with the older ${latest.tag}; ` +
      'pass --force if that downgrade is deliberate'
  );
}

/** Older builds for the download page, newest first, never including the latest. */
export function buildHistory(candidates, latestTag, limit = DEFAULT_HISTORY_LIMIT) {
  if (limit === 0) return [];
  return candidates
    .filter((candidate) => candidate.tag !== latestTag)
    .sort(byPublishedDescending)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Upstream feature manifest
 * ------------------------------------------------------------------ */

function validateString(value, label, { min = 1, max = 600 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max) {
    fail(`${label} must be a ${min}-${max} character string`);
  }
  return value.trim();
}

export function validateFeatureManifest(value) {
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

/* ------------------------------------------------------------------ *
 * Generated modules
 * ------------------------------------------------------------------ */

function typescriptValue(value) {
  return JSON.stringify(value, null, 2);
}

export function releaseModule(data, history, manifest) {
  const release = {
    ...data,
    releaseNotesUrl: `${APP_WEB}/blob/main/${manifest.releaseNotesPath}`,
  };
  const header = [
    '/*',
    ' * Generated by scripts/sync-cambuz-release.mjs from the published GitHub',
    ' * Releases. Do not edit this file by hand: the sync workflow replaces it',
    ' * after every successful Cambuz app build.',
    ' *',
    ' * release        - the newest published build. Every download link on the',
    ' *                  home page and the download page points at these URLs.',
    ' * releaseHistory - older published builds, newest first, so the download',
    ' *                  page can offer previous versions. A release disappears',
    ' *                  from this list when it is deleted upstream.',
    ' */',
    '',
  ].join('\n');

  const historyComment = [
    '/**',
    ' * Previous published builds, newest first. These are kept for rollback and',
    ' * troubleshooting: each one is the exact CI-published asset set with the',
    ' * checksum GitHub reported for it. They are not maintained or patched.',
    ' */',
  ].join('\n');

  return `${header}export const release = ${typescriptValue(release)} as const;

${historyComment}
export const releaseHistory = ${typescriptValue(history)} as const;
`;
}

export function featuresModule(features) {
  return `/*
 * Generated from cambuz-pdf/docs/landing-content.json by
 * scripts/sync-cambuz-release.mjs. Change feature copy in the app repository,
 * then let the release sync publish it here.
 */

import type { Feature } from './features';

export const generatedFeatures = ${typescriptValue(features)} satisfies readonly Feature[];
`;
}

/* ------------------------------------------------------------------ *
 * Current state of the site
 * ------------------------------------------------------------------ */

/**
 * Reads the release the site currently advertises, straight from the generated
 * module (which is plain data, so no TypeScript loader is needed). Returns null
 * on a first run, when the file does not exist yet.
 */
export async function readCurrentRelease(path = RELEASE_OUTPUT) {
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  const tag = /"tag":\s*"([^"]+)"/.exec(text)?.[1];
  const publishedAt = /"publishedAt":\s*"([^"]+)"/.exec(text)?.[1] ?? null;
  if (!tag) return null;
  return { tag, publishedAt };
}

async function writeStepOutputs(values) {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) return;
  const lines = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  await appendFile(path, `${lines}\n`);
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log('Usage: node scripts/sync-cambuz-release.mjs --tag <tag> [--ref <commit>]');
    console.log('       node scripts/sync-cambuz-release.mjs --discover [--history <n>]');
    console.log('');
    console.log('  --tag <tag>        publish this exact published release as the newest');
    console.log('  --ref <commit>     app commit holding docs/landing-content.json');
    console.log('  --discover         publish the newest complete published release');
    console.log(`  --history <n>      older builds to list (default ${DEFAULT_HISTORY_LIMIT}, max ${MAX_HISTORY_LIMIT})`);
    console.log('  --force            allow --tag to replace the published release with an older one');
    console.log('  --dry-run          report what would change without writing files');
    return;
  }

  const previous = await readCurrentRelease();
  if (previous) console.log(`Site currently advertises ${previous.tag}.`);

  const listed = await getJson(`${API_ROOT}/releases?per_page=100`);
  if (!Array.isArray(listed)) fail('release list response is not an array');
  const { candidates, skipped } = collectReleases(listed);
  for (const entry of skipped) warn(`skipping ${entry.tag}: ${entry.reason}`);

  let latest;
  let manifestRef;

  if (options.tag) {
    const release = await getJson(`${API_ROOT}/releases/tags/${encodeURIComponent(options.tag)}`);
    latest = releaseData(release);
    manifestRef = options.ref ?? release.target_commitish ?? 'main';

    // An explicitly named release is normally the one the app just published.
    // Re-syncing the current tag is fine (the history may have moved on), but
    // silently putting an older build back in front of visitors is not.
    assertNoDowngrade(latest, previous, options.force);
  } else {
    const newest = candidates[0];
    if (!newest) fail('no complete, published Cambuz release was found');

    // The site never moves backwards on its own. If the newest complete release
    // is not newer than the one already advertised — a re-published old tag, for
    // example — the published record stays as it is while the history list and
    // the feature copy still refresh.
    const current = previous ? candidates.find((entry) => entry.tag === previous.tag) : undefined;
    latest = current && !isNewer(newest, current) ? current : newest;
    if (current && latest.tag === current.tag && newest.tag !== current.tag) {
      console.log(`Keeping ${current.tag}: ${newest.tag} is not newer than the published release.`);
    }
    if (previous && !current && latest.tag !== previous.tag) {
      warn(
        `${previous.tag} is no longer a published release; falling back to ${latest.tag}`
      );
    }

    const listedRelease = listed.find((entry) => entry.tag_name === latest.tag);
    manifestRef = options.ref ?? listedRelease?.target_commitish ?? 'main';
  }

  const history = buildHistory(candidates, latest.tag, options.history);
  const manifest = await manifestAt(manifestRef);

  console.log(`Publishing ${latest.tag} (${latest.version}) from ${APP_REPOSITORY}.`);
  console.log(
    `Verified ${artifactDefinitions.length} installers and SHA256SUMS.txt; ` +
      `${history.length} previous version${history.length === 1 ? '' : 's'} listed.`
  );
  if (history.length) console.log(`Previous: ${history.map((entry) => entry.tag).join(', ')}`);

  const changed = previous?.tag !== latest.tag;
  await writeStepOutputs({
    tag: latest.tag,
    version: latest.version,
    previous_tag: previous?.tag ?? '',
    history_count: history.length,
    latest_changed: changed,
  });

  if (options.dryRun) {
    console.log('Dry run: no files were written.');
    return;
  }

  await Promise.all([
    writeFile(RELEASE_OUTPUT, releaseModule(latest, history, manifest)),
    writeFile(FEATURES_OUTPUT, featuresModule(manifest.features)),
  ]);
  console.log(`Wrote ${RELEASE_OUTPUT.replace(`${ROOT}/`, '')} and ${FEATURES_OUTPUT.replace(`${ROOT}/`, '')}.`);
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error.message ?? String(error));
    process.exitCode = 1;
  });
}
