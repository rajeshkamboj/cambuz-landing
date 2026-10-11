# Brand assets

Everything the site uses for its identity is generated from **one source of
truth**:

```
assets/icon-master.png    1254 × 1254 RGBA PNG — the official Cambuz icon
```

This is the same master the desktop application packages its Windows, Linux and
macOS icons from. It is never redrawn, recoloured, cropped or substituted — the
generators only rescale it (`Image.LANCZOS`) and, for the two platform-masked
variants, place the artwork on a flat background.

## Regenerating

```bash
pip install pillow            # once
python3 scripts/generate-icon-assets.py
python3 scripts/generate-og-image.py
```

Both scripts refuse to run if the master is missing, is not a square PNG with
transparency, or is smaller than 1024 px — so a packaging step can never quietly
fall back to a generic placeholder.

## What gets written

| Output | Size | How it is derived |
| ------ | ---- | ----------------- |
| `public/favicon.ico` | 16, 32, 48 | full canvas, one frame per size |
| `public/favicon-16.png`, `-32`, `-48` | 16–48 px | full canvas |
| `public/icons/icon-192.png`, `icon-512.png` | 192, 512 px | full canvas — matches the app's own packaged icon |
| `public/icons/maskable-icon-512.png` | 512 px | artwork at the 80 % maskable safe zone, centred on the icon's tile colour |
| `public/apple-touch-icon.png` | 180 px | artwork at 88 %, centred on the tile colour (iOS masks the corners) |
| `public/icons/logo-mark-128.png`, `-256` | 128, 256 px | full canvas, used for the header/footer mark |
| `public/social/og-image.png` | 1200 × 630 | icon + wordmark card for `og:image` / `twitter:image` |
| `public/social/og-square.png` | 1200 × 1200 | square variant of the same card |

The tile colour used for the masked variants is **sampled from the master at
generation time** (currently `#15192e`), not hard-coded, so it always matches
the artwork.

### Site chrome

- The header and footer render `logo-mark-*.png` next to the wordmark as **real
  HTML text** (`Cambuz`), not baked into an image. The wordmark therefore scales
  with the site's own font stack, stays selectable, and is readable to search
  engines and screen readers.
- `index.html` points at the icons, the manifest and the social card. Per-page
  social tags (including the absolute `og:image`) are refreshed at runtime by
  `src/hooks/useSeo.ts`.

## Fonts

`assets/fonts/` holds the Inter cuts used by the social-card generator
(`Inter-Regular/Medium/SemiBold/Bold`, latin subset) plus `OFL.txt`. Inter is
licensed under the **SIL Open Font License 1.1**; the licence text ships next to
the fonts, as the licence requires. These files are only used at build time to
render `public/social/*.png` — the site itself loads Inter from the CSS in
`src/index.css`.

## Colours

The site's own tokens live in `tailwind.config.js` / `src/index.css`
(background `#0B1020`, primary `#367CF6`). The theme colour is
`#0B1020` rather than the icon's tile navy (`#15192e`, close to the `#151d2e` in
the original asset brief) so the mobile browser chrome blends with the page
background. The tile navy is used where it matters — inside the masked app
icons, where it must match the artwork edge to edge.
