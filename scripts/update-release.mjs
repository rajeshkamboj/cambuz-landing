#!/usr/bin/env node
/**
 * Backwards-compatible local entry point for updating the landing site from a
 * published Cambuz release. The GitHub Actions workflow runs the same sync
 * automatically; this command is useful to reproduce it locally.
 *
 *   node scripts/update-release.mjs v1.1.0-build.42 <app-commit-or-ref>
 *   node scripts/update-release.mjs --discover
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const syncScript = join(ROOT, 'scripts', 'sync-cambuz-release.mjs');
const args = process.argv.slice(2);

let forwarded;
if (args[0] === '--discover') {
  forwarded = ['--discover'];
} else if (args[0] && !args[0].startsWith('-')) {
  forwarded = ['--tag', args[0], '--ref', args[1] ?? 'main'];
} else {
  console.error('Usage: node scripts/update-release.mjs <published-tag> [app-commit-or-ref]');
  console.error('       node scripts/update-release.mjs --discover');
  process.exit(1);
}

const child = spawn(process.execPath, [syncScript, ...forwarded], {
  stdio: 'inherit',
  env: process.env,
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
