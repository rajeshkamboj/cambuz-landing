#!/usr/bin/env node
/**
 * Tests for the release sync's decision logic.
 *
 * Run with `npm test`. Nothing here touches the network: the GitHub API
 * responses are fixtures, so a change in how a release is chosen, validated or
 * turned into a generated module fails here instead of on the live site.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  DEFAULT_HISTORY_LIMIT,
  assertNoDowngrade,
  buildHistory,
  byPublishedDescending,
  collectReleases,
  isNewer,
  isAutomaticBuildTag,
  parseArguments,
  readCurrentRelease,
  releaseData,
  releaseModule,
  validateFeatureManifest,
  versionFromTag,
} from './sync-cambuz-release.mjs';

const SUFFIXES = [
  ['win-x64-setup.exe', 102_043_495],
  ['win-x64-portable.exe', 101_625_713],
  ['linux-x86_64.AppImage', 97_509_736],
  ['mac-arm64.dmg', 111_902_143],
  ['mac-arm64.zip', 116_824_325],
];

/** A published release shaped like the ones the app's CI creates. */
function fixtureRelease({
  tag = 'v1.1.0-build.77',
  publishedAt = '2026-10-15T05:54:01Z',
  target = 'f61be45032a0cddd3005c5e6afb52ecacc156012',
  prerelease = true,
  assetOverrides = {},
} = {}) {
  const version = versionFromTag(tag);
  const assets = SUFFIXES.map(([suffix, size], index) => {
    const name = `Cambuz-PDF-Reader-${version}${suffix.startsWith('-') ? '' : '-'}${suffix}`;
    return {
      name,
      size,
      digest: `sha256:${String(index).repeat(64).slice(0, 64)}`,
      browser_download_url: `https://github.com/rajeshkamboj/cambuz-pdf/releases/download/${tag}/${name}`,
      ...(assetOverrides[name] ?? {}),
    };
  });
  const checksum = 'SHA256SUMS.txt';
  assets.push({
    name: checksum,
    size: 539,
    digest: `sha256:${'a'.repeat(64)}`,
    browser_download_url: `https://github.com/rajeshkamboj/cambuz-pdf/releases/download/${tag}/${checksum}`,
  });
  return {
    tag_name: tag,
    target_commitish: target,
    prerelease,
    draft: false,
    published_at: publishedAt,
    assets: assetOverrides.__assets ?? assets,
  };
}

test('accepts the tag shapes the app publishes', () => {
  assert.equal(versionFromTag('v1.1.0-build.77'), '1.1.0');
  assert.equal(versionFromTag('v1.1.0-rc1'), '1.1.0');
  assert.equal(versionFromTag('v2.0.0'), '2.0.0');
  assert.equal(versionFromTag('nightly'), null);
  assert.equal(versionFromTag('1.1.0'), null);

  assert.equal(isAutomaticBuildTag('v1.1.0-build.77'), true);
  assert.equal(isAutomaticBuildTag('v1.1.0-rc1'), false);
});

test('reads a complete release into the published record', () => {
  const data = releaseData(fixtureRelease());

  assert.equal(data.tag, 'v1.1.0-build.77');
  assert.equal(data.version, '1.1.0');
  assert.equal(data.automaticBuild, true);
  assert.equal(data.publishedAt, '2026-10-15T05:54:01Z');
  assert.equal(data.sourceCommit, 'f61be45032a0cddd3005c5e6afb52ecacc156012');
  assert.equal(
    data.releasePageUrl,
    'https://github.com/rajeshkamboj/cambuz-pdf/releases/tag/v1.1.0-build.77'
  );
  assert.deepEqual(Object.keys(data.artifacts).sort(), [
    'checksums',
    'linuxX8664AppImage',
    'macArm64Dmg',
    'macArm64Zip',
    'winX64Portable',
    'winX64Setup',
  ]);
  assert.equal(data.artifacts.winX64Setup.bytes, 102_043_495);
  assert.match(data.artifacts.winX64Setup.sha256, /^[0-9a-f]{64}$/);
});

test('refuses a release the site must not publish', () => {
  // Missing one advertised installer.
  const incomplete = fixtureRelease({
    assetOverrides: {
      __assets: fixtureRelease().assets.filter(
        (asset) => !asset.name.endsWith('-mac-arm64.zip')
      ),
    },
  });
  assert.throws(() => releaseData(incomplete), /exactly one -mac-arm64\.zip/);

  // No checksum list.
  const noChecksums = fixtureRelease({
    assetOverrides: {
      __assets: fixtureRelease().assets.filter((asset) => asset.name !== 'SHA256SUMS.txt'),
    },
  });
  assert.throws(() => releaseData(noChecksums), /missing SHA256SUMS\.txt/);

  // GitHub did not report a digest, so the site cannot publish a checksum.
  const base = fixtureRelease();
  const withoutDigest = fixtureRelease({
    assetOverrides: {
      __assets: base.assets.map((asset) =>
        asset.name === 'SHA256SUMS.txt' ? { ...asset, digest: null } : asset
      ),
    },
  });
  assert.throws(() => releaseData(withoutDigest), /no GitHub SHA-256 digest/);

  // A download URL that is not a permanent release asset link.
  const wrongHost = fixtureRelease();
  const foreignUrl = fixtureRelease({
    assetOverrides: {
      __assets: wrongHost.assets.map((asset) =>
        asset.name === 'SHA256SUMS.txt'
          ? { ...asset, browser_download_url: 'https://example.com/SHA256SUMS.txt' }
          : asset
      ),
    },
  });
  assert.throws(() => releaseData(foreignUrl), /permanent GitHub download URL/);

  // A tag that is not a version at all.
  assert.throws(() => releaseData(fixtureRelease({ tag: 'nightly' })), /not a supported version tag/);
});

test('never claims a commit for a tag pushed by hand', () => {
  const data = releaseData(fixtureRelease({ tag: 'v1.1.0-rc1', target: 'main' }));
  assert.equal(data.sourceCommit, null);
  assert.equal(data.automaticBuild, false);
});

test('collects complete releases newest first and reports the rest', () => {
  const { candidates, skipped } = collectReleases([
    fixtureRelease({ tag: 'v1.1.0-build.53', publishedAt: '2026-10-12T01:10:12Z' }),
    fixtureRelease({ tag: 'v1.1.0-build.77', publishedAt: '2026-10-15T05:54:01Z' }),
    fixtureRelease({ tag: 'v1.1.0-rc1', publishedAt: '2026-10-11T16:50:03Z' }),
    { tag_name: 'v1.0.0-build.10', draft: true, assets: [] },
    { tag_name: 'scratch', published_at: '2026-10-01T00:00:00Z', assets: [] },
  ]);

  assert.deepEqual(
    candidates.map((entry) => entry.tag),
    ['v1.1.0-build.77', 'v1.1.0-build.53', 'v1.1.0-rc1']
  );
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].tag, 'scratch');
});

test('history excludes the latest build and honours the limit', () => {
  const { candidates } = collectReleases([
    fixtureRelease({ tag: 'v1.1.0-build.77', publishedAt: '2026-10-15T05:54:01Z' }),
    fixtureRelease({ tag: 'v1.1.0-build.53', publishedAt: '2026-10-12T01:10:12Z' }),
    fixtureRelease({ tag: 'v1.1.0-rc1', publishedAt: '2026-10-11T16:50:03Z' }),
  ]);

  assert.deepEqual(
    buildHistory(candidates, 'v1.1.0-build.77').map((entry) => entry.tag),
    ['v1.1.0-build.53', 'v1.1.0-rc1']
  );
  assert.deepEqual(
    buildHistory(candidates, 'v1.1.0-build.77', 1).map((entry) => entry.tag),
    ['v1.1.0-build.53']
  );
  assert.deepEqual(buildHistory(candidates, 'v1.1.0-build.77', 0), []);
  assert.equal(DEFAULT_HISTORY_LIMIT, 12);
});

test('the site never moves backwards to an older release', () => {
  const newer = { tag: 'v1.1.0-build.77', publishedAt: '2026-10-15T05:54:01Z' };
  const older = { tag: 'v1.1.0-build.53', publishedAt: '2026-10-12T01:10:12Z' };
  const republished = { tag: 'v1.1.0-build.53', publishedAt: '2026-10-16T00:00:00Z' };

  assert.equal(isNewer(newer, older), true);
  assert.equal(isNewer(older, newer), false);
  // Same release seen again: nothing to do, so the generated file stays byte-stable.
  assert.equal(isNewer(newer, { ...newer }), false);
  // A re-published older tag is still allowed if GitHub says it is newer.
  assert.equal(isNewer(republished, newer), true);
});

test('ordering is deterministic', () => {
  const entries = [
    { tag: 'b', publishedAt: '2026-10-12T01:10:12Z' },
    { tag: 'c', publishedAt: null },
    { tag: 'a', publishedAt: '2026-10-12T01:10:12Z' },
  ];
  assert.deepEqual(
    [...entries].sort(byPublishedDescending).map((entry) => entry.tag),
    ['b', 'a', 'c']
  );
});

test('arguments are validated', () => {
  assert.deepEqual(parseArguments(['--discover']), {
    tag: undefined,
    ref: undefined,
    discover: true,
    history: DEFAULT_HISTORY_LIMIT,
    dryRun: false,
    force: false,
    help: false,
  });
  assert.equal(parseArguments(['--tag', 'v1.1.0-build.77', '--history', '5']).history, 5);
  assert.equal(parseArguments(['--tag', 'v1.1.0-build.77', '--force']).force, true);
  assert.throws(() => parseArguments([]), /pass --tag/);
  assert.throws(() => parseArguments(['--discover', '--tag', 'v1']), /not both/);
  assert.throws(() => parseArguments(['--discover', '--history', '999']), /--history must be/);
  assert.throws(() => parseArguments(['--discover', '--nope']), /unknown argument/);
  assert.equal(parseArguments(['--help']).help, true);
});

test('an explicitly named older release is refused unless forced', () => {
  const published = { tag: 'v1.1.0-build.77', publishedAt: '2026-10-15T05:54:01Z' };
  const older = { tag: 'v1.1.0-build.53', publishedAt: '2026-10-12T01:10:12Z' };

  // Re-syncing what is already published is a no-op, not a downgrade.
  assert.doesNotThrow(() => assertNoDowngrade(published, published));
  assert.doesNotThrow(() => assertNoDowngrade(older, published, true));
  assert.doesNotThrow(() => assertNoDowngrade(older, null));
  assert.throws(
    () => assertNoDowngrade(older, published),
    /refusing to replace the published v1\.1\.0-build\.77/
  );
});

test('generated module carries the latest build and the history', () => {
  const latest = releaseData(fixtureRelease());
  const { candidates } = collectReleases([
    fixtureRelease({ tag: 'v1.1.0-build.53', publishedAt: '2026-10-12T01:10:12Z' }),
    fixtureRelease(),
  ]);
  const history = buildHistory(candidates, latest.tag);
  const module = releaseModule(latest, history, {
    releaseNotesPath: 'docs/RELEASE-NOTES-1.1.0.md',
    features: [],
  });

  assert.match(module, /export const release = \{/);
  assert.match(module, /export const releaseHistory = \[/);
  assert.match(module, /"tag": "v1\.1\.0-build\.77"/);
  assert.match(module, /"tag": "v1\.1\.0-build\.53"/);
  assert.match(
    module,
    /releaseNotesUrl": "https:\/\/github\.com\/rajeshkamboj\/cambuz-pdf\/blob\/main\/docs\/RELEASE-NOTES-1\.1\.0\.md"/
  );
  // The module must be reproducible: no timestamps or run-specific values.
  assert.doesNotMatch(module, /generatedAt|Date\(/);
  assert.equal(module, releaseModule(latest, history, {
    releaseNotesPath: 'docs/RELEASE-NOTES-1.1.0.md',
    features: [],
  }));
});

test('reads the release the site currently advertises', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cambuz-sync-'));
  try {
    const missing = join(directory, 'not-there.ts');
    assert.equal(await readCurrentRelease(missing), null);

    const file = join(directory, 'release.generated.ts');
    await writeFile(
      file,
      'export const release = {\n  "tag": "v1.1.0-build.53",\n  "publishedAt": "2026-10-12T01:10:12Z"\n} as const;\n'
    );
    assert.deepEqual(await readCurrentRelease(file), {
      tag: 'v1.1.0-build.53',
      publishedAt: '2026-10-12T01:10:12Z',
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('the feature manifest contract is enforced', () => {
  const feature = {
    id: 'reading-view',
    headline: 'Read without clutter',
    description: 'A reading view that shows the page and nothing else.',
    bullets: ['One page at a time', 'Fit to width'],
    screenshotAlt: 'Cambuz showing a page in the reading view',
    screenshotCaption: 'The reading view',
    icon: 'book-open',
  };

  const manifest = validateFeatureManifest({
    schemaVersion: 1,
    releaseNotesPath: 'docs/RELEASE-NOTES-1.1.0.md',
    features: [feature],
  });
  assert.equal(manifest.features.length, 1);
  assert.equal(manifest.releaseNotesPath, 'docs/RELEASE-NOTES-1.1.0.md');

  assert.throws(
    () => validateFeatureManifest({ schemaVersion: 2, releaseNotesPath: 'a.md', features: [feature] }),
    /schemaVersion 1/
  );
  assert.throws(
    () =>
      validateFeatureManifest({
        schemaVersion: 1,
        releaseNotesPath: '../secrets.md',
        features: [feature],
      }),
    /repository-relative Markdown path/
  );
  assert.throws(
    () => validateFeatureManifest({ schemaVersion: 1, releaseNotesPath: 'docs/x.md', features: [] }),
    /between 1 and 20 features/
  );
  assert.throws(
    () => validateFeatureManifest({ schemaVersion: 1, releaseNotesPath: 'docs/x.md', features: [{ ...feature, id: 'Bad Id' }] }),
    /invalid or duplicated/
  );
});
