#!/usr/bin/env node
/**
 * Proves the built site ships exactly the downloads the released app published.
 *
 * Every download link, release page link and SHA-256 the site shows comes from
 * `src/config/release.generated.ts`. This script reads that file, then checks
 * that each of those strings is present in the JavaScript bundle that
 * `npm run build` produced. It is the last link in the chain:
 *
 *   cambuz-pdf publishes a release
 *     -> sync-cambuz-release.mjs writes the generated record
 *       -> the site renders from it
 *         -> this check fails the workflow if a URL went missing on the way
 *
 * Usage: node scripts/check-built-downloads.mjs   (run `npm run build` first)
 */

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const GENERATED = join(ROOT, 'src', 'config', 'release.generated.ts');
const DIST = join(ROOT, 'dist', 'assets');

function fail(message) {
  console.error(`check-built-downloads: ${message}`);
  process.exit(1);
}

const generated = await readFile(GENERATED, 'utf8').catch(() =>
  fail(`cannot read ${GENERATED}; run the release sync first`)
);

const bundleNames = await readdir(DIST).catch(() =>
  fail(`cannot read ${DIST}; run "npm run build" first`)
);
const bundles = (
  await Promise.all(
    bundleNames
      .filter((name) => name.endsWith('.js'))
      .map((name) => readFile(join(DIST, name), 'utf8'))
  )
).join('\n');
if (!bundles) fail('the build produced no JavaScript bundles');

/** Every download URL, release page URL and checksum published for every version. */
const downloads = [...new Set(generated.match(/https:\/\/github\.com\/[^"]+/g) ?? [])];
const checksums = [...new Set(generated.match(/[0-9a-f]{64}/g) ?? [])];

const missing = [
  ...downloads.filter((value) => !bundles.includes(value)),
  ...checksums.filter((value) => !bundles.includes(value)),
];

if (downloads.length === 0) fail('the generated release record contains no links at all');

if (missing.length) {
  console.error('check-built-downloads: the built site is missing published values:');
  for (const value of missing) console.error(`  - ${value}`);
  fail(`${missing.length} of ${downloads.length + checksums.length} published values are absent`);
}

const versions = generated.match(/"tag":\s*"([^"]+)"/g)?.length ?? 0;
console.log(
  `check-built-downloads: ${downloads.length} published links and ${checksums.length} checksums ` +
    `across ${versions} version${versions === 1 ? '' : 's'} are present in the built bundle.`
);
