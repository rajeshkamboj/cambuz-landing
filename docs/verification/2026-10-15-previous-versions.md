# Verification — automatic download sync and previous versions

Date: 2026-10-15 · Branch: `arena/a1b942cb-cambuz-landing`

What was changed and how it was checked. All commands were run in this branch's
working tree against the live `rajeshkamboj/cambuz-pdf` releases.

## What changed

1. `scripts/sync-cambuz-release.mjs` now publishes two records in one pass: the
   newest published build (`release`) and the older published builds
   (`releaseHistory`), both read from the GitHub Releases API with the same
   validation as before. It also refuses to move the site backwards, skips
   incomplete *older* releases with a warning instead of failing, and can report
   what it would do with `--dry-run`.
2. `src/config/site.ts` resolves one reviewed artifact catalog against any
   release, so the newest downloads and the previous versions cannot disagree
   about labels, install steps or platforms.
3. `src/components/PreviousVersions.tsx` renders `/download/#previous-versions`
   from that record, and the home page and download page keep deriving every
   link, size and checksum from the newest release.
4. `scripts/sync-cambuz-release.test.mjs` (13 tests, `npm test`) + 
   `scripts/check-built-downloads.mjs` (`npm run verify:downloads`).
5. The sync workflow runs the tests before writing, and the built-bundle check
   before committing.

## 1. The sync reads the real releases correctly

```console
$ node scripts/sync-cambuz-release.mjs --discover --dry-run
Site currently advertises v1.1.0-build.77.
Publishing v1.1.0-build.77 (1.1.0) from rajeshkamboj/cambuz-pdf.
Verified 5 installers and SHA256SUMS.txt; 2 previous versions listed.
Previous: v1.1.0-build.53, v1.1.0-rc1
Dry run: no files were written.
```

The older builds and their checksums match the API exactly:

```console
$ gh api repos/rajeshkamboj/cambuz-pdf/releases --jq '.[] | "\(.tag_name) \(.published_at) \(.assets | length)"'
v1.1.0-build.77   2026-10-15T05:54:01Z  6
v1.1.0-build.53   2026-10-12T01:10:12Z  6
v1.1.0-rc1        2026-10-11T16:50:03Z  6
```

`v1.1.0-rc1` was pushed by hand, so `target_commitish` is the string `main`
rather than a commit; the generated record publishes `"sourceCommit": null` for
it and the UI shows no commit link rather than claiming one. A hand-pushed tag
is labelled "release candidate" and an automatic build "automatic build".

## 2. Backwards protection

```console
$ node scripts/sync-cambuz-release.mjs --tag v1.1.0-build.53 --ref main --dry-run
sync-cambuz-release: refusing to replace the published v1.1.0-build.77 with the
older v1.1.0-build.53; pass --force if that downgrade is deliberate   [exit 1]

$ node scripts/sync-cambuz-release.mjs --tag v1.1.0-build.77 --ref <sha> --dry-run
Publishing v1.1.0-build.77 (1.1.0) ...                                [exit 0]

$ node scripts/sync-cambuz-release.mjs --tag v1.1.0-build.53 --ref main --force --dry-run
Publishing v1.1.0-build.53 (1.1.0) ...
Previous: v1.1.0-build.77, v1.1.0-rc1                                 [exit 0]
```

## 3. The rendered pages carry the published links

A server-side render of both pages was checked against the generated record —
the download page while the default Windows tab is active, so the Linux and
macOS tabs were read from the built bundle instead (section 4):

- every download URL of every version is an `href`; **0** of 18 missing;
- each older version renders all 5 installers, its `SHA256SUMS.txt`, its release
  page and its source-commit link (**7 links × 2 versions, 0 missing**);
- each older version renders its own published SHA-256 values, and the newest
  build's table is unchanged;
- published dates render as `12 Oct 2026` / `11 Oct 2026` from the API
  timestamps, with `<time datetime>` set;
- the home page's hero button and installer line point at the newest build
  (`releases/download/v1.1.0-build.77/Cambuz-PDF-Reader-1.1.0-win-x64-setup.exe`).

## 4. The built site cannot silently drift

```console
$ npm run verify:downloads
check-built-downloads: 22 published links and 18 checksums across 3 versions are
present in the built bundle.
```

The check was confirmed to fail rather than pass vacuously: after rewriting
`v1.1.0-rc1` out of the bundle, it reported all 7 affected values and exited
non-zero.

```console
check-built-downloads: the built site is missing published values:
  - https://github.com/rajeshkamboj/cambuz-pdf/releases/tag/v1.1.0-rc1
  - https://github.com/rajeshkamboj/cambuz-pdf/releases/download/v1.1.0-rc1/...
check-built-downloads: 7 of 40 published values are absent
```

## 5. Test suite

```console
$ npm test
# tests 13
# pass 13
# fail 0
```

Covers: tag shapes, a complete release becoming a record, refusal of a release
missing an installer / `SHA256SUMS.txt` / a digest / a permanent URL, hand-pushed
tags not claiming a commit, newest-first collection with skipped releases
reported, history limiting and exclusion of the latest build, the no-downgrade
rule, deterministic ordering, argument validation, generated-module
reproducibility (no timestamps) and the feature-manifest contract.

## 6. Build

```console
$ npm run typecheck && npm run lint && npm run build
dist/assets/index-PZPNNywe.js   310.44 kB │ gzip: 88.24 kB
✓ built in 2.58s
```

## Not verified

- No browser pass: this environment has no browser, so the `<details>` rows were
  not opened interactively and there are no screenshots in this record. The
  markup, links and copy were verified from the render above and from the built
  bundle; the open/closed states use native `<details>`/`<summary>`.
- The sync workflow itself was not executed on GitHub from this branch: it runs
  on `main`, so it takes effect once this branch is merged. Its shell steps were
  run locally with the same environment variables, and the YAML parses.
