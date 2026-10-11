# Product screenshots

All product screenshots live in **`public/screenshots/`**.

Vite serves everything in `public/` from the site root, so a file at
`public/screenshots/feature-search.png` is referenced in code as
`/screenshots/feature-search.png` — and it is copied into `dist/` on build,
no import required.

Paths are declared once in [`src/data/screenshots.ts`](../src/data/screenshots.ts);
components read from that map. **Drop a file in with the name below and it
appears — no code change needed.**

## Drop-in checklist

Save each screenshot with exactly this file name in `public/screenshots/`:

| # | File name in `public/screenshots/` | Where it appears | Caption shown |
| - | ---------------------------------- | ---------------- | ------------- |
| 1 | `hero-reading-view.png` | Home page hero (`/`) | The Cambuz reading interface |
| 2 | `feature-reading.png` | Home + Features — "Just you and the document." | The main reading interface with page navigation and zoom controls |
| 3 | `feature-search.png` | Home + Features — "Search less. Find more." | Search results highlighted with navigation between matches |
| 4 | `feature-selection.png` | Home + Features — "Select. Copy. Keep moving." | Text selection in a PDF document ready to copy |
| 5 | `feature-print.png` | Home + Features — "From PDF to paper." | Print preview with page range selection |
| 6 | `feature-languages.png` | Home + Features — "Made for the documents you actually read." | A Hindi-language PDF rendered in Cambuz |
| 7 | `feature-desktop.png` | Home + Features — "A desktop tool, not another upload form." | Cambuz running as a native desktop application |
| 8 | `page-windows-reading-view.png` | `/free-pdf-reader-windows/` | Cambuz PDF Reader on Windows |
| 9 | `page-lightweight-reading-view.png` | `/lightweight-pdf-reader/` | The Cambuz reading interface — clean and focused |
| 10 | `page-offline-local-file.png` | `/offline-pdf-reader/` | Cambuz reading a local PDF file without an internet connection |
| 11 | `page-print-preview.png` | `/print-pdf-windows/` | Print preview with page range selection in Cambuz |
| 12 | `page-hindi-devanagari.png` | `/read-hindi-punjabi-pdf/` | A Hindi-language PDF rendered in Cambuz |

That's **12 files**. Slots 2–7 are reused on both the home page and
`/features/`, so one file each covers both.

## Image specs

| Property | Recommendation |
| -------- | -------------- |
| Aspect ratio | **16:10** (the frame is fixed at `aspect-[16/10]` and images are `object-cover`) |
| Size | **1600 × 1000 px** (3200 × 2000 for retina is fine, but doubles page weight) |
| Format | **PNG** for UI screenshots — crisp text, flat colours compress well |
| Weight | Aim for **≤ 300 KB per file** (compress with `pngquant` / Squoosh if larger) |
| Content | Crop to the app window itself. The `frame="app"` chrome (title bar, borders, shadow) is drawn by the component — don't bake it into the image. |

Using a different extension or file name? Change the path in
`src/data/screenshots.ts` for that slot — that's the only place it is written.

## How the fallback works

Until a file exists, `<Screenshot>` renders an abstract placeholder at the
correct size so the layout stays intact. In `npm run dev` it also prints the
expected path to the browser console and under the placeholder:

```
[Screenshot] No image at public/screenshots/feature-search.png.
Add the file (see docs/screenshots.md) — showing placeholder instead.
```

Placeholders are visible in production too (a missing file is never a broken
image icon). The console warning and path hint only appear in dev.

## Not covered here

- `public/og-image.svg` is the social/Open Graph card. Most platforms
  (WhatsApp, Facebook, LinkedIn, X) **do not render SVG** for `og:image` — when
  you have a hero shot, export a **1200 × 630 PNG** as `public/og-image.png` and
  update the `og:image` / `twitter:image` references in `index.html`.
- The logo and favicon are vector assets in `public/` (`logo.svg`,
  `favicon.svg`) and are not part of the screenshot set.
