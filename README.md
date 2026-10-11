# cambuz-landing

Marketing site for Cambuz PDF Reader.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run typecheck
npm run lint
```

## Download links

Every download URL on the site is derived from a single release tag in
[`src/config/site.ts`](src/config/site.ts):

```ts
const RELEASE_TAG = 'v1.1.0-rc1';
const RELEASE_BASE = `https://github.com/rajeshkamboj/cambuz-pdf/releases/download/${RELEASE_TAG}`;
```

To move the site to a newer build:

```bash
node scripts/update-release.mjs v1.1.0        # rewrite the tag + version
node scripts/update-release.mjs --check       # verify the release assets exist
```

`--check` asks the GitHub API for the release and prints every asset with its
size, name and whether the site's artifact list matches. It exits non-zero on a
mismatch, so it is safe to run in CI or by hand after publishing a release.

Two rules that matter:

- **The tag is pinned on purpose.** GitHub excludes pre-releases from
  `/releases/latest`, so a "latest" link would not reach `v1.1.0-rc1`. When
  1.1.0 is promoted to a full release, point the tag at it — the file names stay
  the same.
- **File sizes and SHA-256 values are facts, not estimates.** They come from the
  published release (asset sizes from the Releases API, checksums from
  `SHA256SUMS.txt`). Re-check them whenever the tag changes.

The page copy is deliberately explicit that 1.1.0 is a release candidate: the
automated acceptance pass is green on CI, the manual pass on real hardware has
not happened yet, the builds are unsigned, and Linux/macOS are experimental
previews. Please keep it that way — the app's own
[README](https://github.com/rajeshkamboj/cambuz-pdf#readme) is the source of
truth for what the build does and does not do.

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
