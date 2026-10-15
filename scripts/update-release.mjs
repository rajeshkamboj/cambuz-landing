#!/usr/bin/env node
/**
 * Local entry point for updating the landing site from a published Cambuz
 * release. The GitHub Actions workflow runs the same sync automatically; this
 * command exists to reproduce or inspect it locally.
 *
 *   node scripts/update-release.mjs v1.1.0-build.42 <app-commit-or-ref>
 *   node scripts/update-release.mjs --discover
 *   node scripts/update-release.mjs --discover --history 20 --dry-run
 *
 * Any flag accepted by scripts/sync-cambuz-release.mjs can be appended.
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const syncScript = join(ROOT, 'scripts', 'sync-cambuz-release.mjs');
const [first, second, ...rest] = process.argv.slice(2);

let forwarded;
if (!first) {
  console.error('Usage: node scripts/update-release.mjs <published-tag> [app-commit-or-ref] [flags]');
  console.error('       node scripts/update-release.mjs --discover [flags]');
  process.exit(1);
} else if (first.startsWith('-')) {
  forwarded = [first, ...(second ? [second] : []), ...rest];
} else {
  forwarded = ['--tag', first, '--ref', second ?? 'main', ...rest];
}

const child = spawn(process.execPath, [syncScript, ...forwarded], {
  stdio: 'inherit',
  env: process.env,
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
