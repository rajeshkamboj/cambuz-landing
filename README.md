# cambuz-landing

Marketing site for Cambuz PDF Reader.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm test           # release-sync decision logic
npm run typecheck
npm run lint
```

## Automatic Cambuz release sync

Every merge to `cambuz-pdf` `main` triggers a versioned pre-release build. When
all five advertised installers succeed, its release workflow publishes them with
`SHA256SUMS.txt`, updates the app README with their permanent direct URLs, and
sends this repository a `cambuz-release-published` event. This repository then
verifies the named release with the GitHub API and commits two generated files:

- [`src/config/release.generated.ts`](src/config/release.generated.ts) — the exact
  tag, asset URL, byte count and GitHub-provided SHA-256 digest for every
  advertised download, for the newest published build (`release`) **and** for
  the older ones (`releaseHistory`);
- [`src/data/features.generated.ts`](src/data/features.generated.ts) — reviewed
  product copy from `cambuz-pdf/docs/landing-content.json`.

All React pages derive download URLs and checksums from that generated release
record, so the home page, the download page and the previous-version list cannot
drift from the published release. The page never uses `/releases/latest`:
automatic builds are pre-releases, and every link stays pinned to the precise
public asset that was verified. The workflow also runs hourly as a repair path
if the immediate event is missed.

### Previous versions on /download

`/download/#previous-versions` lists the older published builds, newest first,
each with its own five installers, published checksums, release page and source
commit. The list is generated from the same verified API data as the newest
build, which means:

- a build appears as soon as it is published and moves down the list as newer
  builds arrive;
- deleting a release upstream removes it from the list on the next sync;
- the list is capped at the 12 most recent older builds by default — pass
  `--history <n>` (0–50) to `sync-cambuz-release.mjs`, or use the **history**
  input of the manual workflow run, to change that;
- older builds are labelled as superseded and unmaintained on the page. The
  newest build is always what the site leads with.

The sync will not move the site backwards. If the release it is asked to publish
is not newer than the one already advertised — a re-published old tag, or a
dispatch that arrives out of order — the published record stays where it is, the
run warns and succeeds, and the history list and feature copy still refresh. Only
an explicit `--force` (the workflow's **force** input) performs a deliberate
downgrade.

### Verification

```bash
npm test                  # decision logic of the sync, from API fixtures
npm run typecheck
npm run lint
npm run build
npm run verify:downloads  # every published link/checksum is in the built bundle
```

`npm run verify:downloads` reads the generated record and fails if any published
download URL, release page URL or SHA-256 is absent from `dist/`. It is the step
that would catch a download link being hardcoded, dropped or renamed anywhere
between the sync and the built site, and it runs in the sync workflow too.

### One-time GitHub setup

The event needs a fine-grained GitHub PAT because `GITHUB_TOKEN` cannot dispatch
a workflow in another repository. Create a token that is restricted to the
`rajeshkamboj/cambuz-landing` repository with **Contents: read and write**
permission. Save it in the **cambuz-pdf** repository as the Actions secret
`CAMBUZ_LANDING_DISPATCH_TOKEN`. Do not put a token in either repository or in a
workflow file.

The landing workflow itself uses its repository-scoped `GITHUB_TOKEN` only to
commit its two generated files to `main`. Its `permissions: contents: write`
setting must remain enabled. If branch protection later blocks bot commits,
allow `cambuz-release-sync[bot]` to push, or change that final workflow step to
open a PR instead.

### Local recovery / verification

To reproduce a specific sync locally (after the upstream feature manifest is
present), run:

```bash
node scripts/update-release.mjs v1.1.0-build.42 <app-commit-sha>
node scripts/update-release.mjs --discover --dry-run   # report without writing
npm test && npm run typecheck && npm run lint && npm run build
```

`node scripts/update-release.mjs --discover` selects the newest published
complete release without calling GitHub's `/releases/latest` endpoint. The sync
refuses a newest release that lacks any expected installer, `SHA256SUMS.txt`, an
API-supplied SHA-256 digest, a permanent asset URL or a valid feature manifest:
it never guesses file sizes or checksums, and it leaves the site untouched when
a release is incomplete. An older release that cannot be read completely is
skipped with a warning instead, so it cannot block a new build from shipping.

### Feature-copy contract

No automated process can truthfully infer marketing claims from arbitrary source
code. `cambuz-pdf/docs/landing-content.json` is therefore the reviewed,
machine-readable source of truth for feature text. A feature PR should update
that manifest alongside its README and tests; after the merge, the released app
build, app README and landing Features page stay aligned automatically. A new
feature may reuse an existing `screenshotId` or omit it; the site deliberately
shows a placeholder until a genuine screenshot is added.

## Brand assets

Icons, favicons, the installable-app icons and the social card are all generated
from the official icon, `assets/icon-master.png`:

```bash
pip install pillow
python3 scripts/generate-icon-assets.py
python3 scripts/generate-og-image.py
```

See [docs/brand-assets.md](docs/brand-assets.md) for the full list of outputs,
the rescale-only rule and the font licensing.

## Product screenshots

Product visuals are served from `public/screenshots/` and rendered through
`<Screenshot>` — 10 WebP files at 2048 × 1280 (16:10).

Paths are declared in [`src/data/screenshots.ts`](src/data/screenshots.ts);
[`docs/screenshots.md`](docs/screenshots.md) maps each file to the slots that
use it. To change a screenshot, drop the new file in `public/screenshots/` and
point the relevant entry at it — that is the whole process. If an entry points
at a missing file, `<Screenshot>` falls back to a correctly-sized placeholder
rather than a broken image.

The images already contain the real application window, so `<Screenshot>` draws
its decorative window chrome only for the placeholder.

## Deployment notes

- The public origin is `https://cambuz.pixldot.com` — it is defined once, as
  `siteConfig.productionDomain`, and used for canonicals, the sitemap,
  `robots.txt` and the absolute `og:image`. Change it there if the domain
  changes.
- The site is a client-side SPA with trailing-slash routes, so the host must
  rewrite unknown paths to `index.html` for deep links such as `/download/` to
  work.
