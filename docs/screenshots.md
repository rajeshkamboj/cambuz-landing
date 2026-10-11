# Product screenshots

Product screenshots live in **`public/screenshots/`**. Vite serves everything in
`public/` from the site root, so `public/screenshots/feature-search.webp` is
referenced in code as `/screenshots/feature-search.webp` and is copied into
`dist/` on build — no import required.

Paths are declared once in [`src/data/screenshots.ts`](../src/data/screenshots.ts);
components read from that map.

## Current assets

All 10 files are **2048 × 1280 WebP (16:10)** — the exact ratio of the
`<Screenshot>` frame, so nothing is cropped or letterboxed. Total weight across
the set is ~420 KB.

| File | What it shows | Used by |
| ---- | ------------- | ------- |
| `hero-reading-view.webp` | Document open on page 1, thumbnail sidebar visible | Home hero, `/offline-pdf-reader/` |
| `feature-reading.webp` | Document open on page 2, thumbnail 2 selected | Home + Features — reading |
| `feature-search.webp` | Search for "page" — 25 matches, highlights on every hit | Home + Features — search |
| `feature-text-selection.webp` | Same document with a text run selected (blue highlight) | Home + Features — selection |
| `feature-print-preview.webp` | Print preview dialog — page range `1-2`, printer, paper size, scaling | Home + Features — print, `/print-pdf-windows/` |
| `feature-hindi.webp` | `hindi-sample.pdf` — Devanagari script rendered | Home + Features — languages, `/read-hindi-punjabi-pdf/` |
| `feature-punjabi.webp` | `punjabi-sample.pdf` — Gurmukhi script rendered | `/read-hindi-punjabi-pdf/` |
| `welcome-screen.webp` | Empty state — "Open a PDF to get started", sample-file buttons | Home + Features — desktop |
| `theme-light.webp` | Reading view in the light theme | `/free-pdf-reader-windows/` |
| `lightweight-clean-view.webp` | Document with the sidebar collapsed, no chrome beyond the toolbar | `/lightweight-pdf-reader/` |

`feature-print-preview.webp`, `feature-hindi.webp` and
`hero-reading-view.webp` are each reused by two slots — that is intentional,
not a missing asset.

## Not yet available

There is no dedicated screenshot for these, so they reuse the closest match:

- **Offline reading** — reuses `hero-reading-view.webp`. A shot of the reader
  with no network activity would be indistinguishable to a visitor, but a
  purpose-made one showing a local file path would be better.
- **Punjabi on the home page** — the languages feature card uses the Hindi
  shot. Both scripts share one slot, so only one can appear there.

## Adding or replacing a screenshot

1. Drop the file into `public/screenshots/`.
2. Point the relevant entry in `src/data/screenshots.ts` at it.

That is the whole process. Requirements:

| Property | Value |
| -------- | ----- |
| Aspect ratio | **16:10** required — the frame is fixed at `aspect-[16/10]` and images render `object-cover`, so any other ratio is cropped |
| Size | 2048 × 1280 (current baseline). 1024 × 640 is fine for a smaller payload |
| Format | WebP (current). PNG also works for UI shots |
| Weight | Keep under ~300 KB per file |
| Content | The real application window — do **not** crop the title bar out. `<Screenshot>` detects a real image and suppresses its decorative window chrome, which is only drawn for the fallback placeholder. |

## How the fallback works

If an entry in `src/data/screenshots.ts` points at a file that is missing or
typo'd, `<Screenshot>` swaps in a correctly-sized placeholder instead of a
broken image, and in `npm run dev` logs the path it expected:

```
[Screenshot] No image at public/screenshots/feature-search.webp.
Add the file (see docs/screenshots.md) — showing placeholder instead.
```

## Open question: the OCR toolbar button

Every screenshot shows an **OCR** button in the application toolbar, but the
site copy states the opposite in three places:

- `src/data/faq.ts` — "Does Cambuz include OCR?" → *"No. Cambuz does not include
  optical character recognition."*
- `src/pages/LightweightPage.tsx` — lists "No OCR (optical character
  recognition)" under deliberately excluded features.
- `src/pages/AlternativesPage.tsx` — lists "OCR for scanned documents" as a
  reason to choose a different tool.

Either the application has gained OCR support and the copy needs updating, or
the button is inert and the screenshots advertise a feature that does not work.
Worth resolving before publishing, since the screenshots are now visible on
every page.

## Not covered here

- `public/og-image.svg` is the social/Open Graph card. Most platforms
  (WhatsApp, Facebook, LinkedIn, X) **do not render SVG** for `og:image`. Now
  that `hero-reading-view.webp` exists, export it as a **1200 × 630 PNG** named
  `public/og-image.png` and update the `og:image` / `twitter:image` references
  in `index.html`.
- The logo and favicon are vector assets in `public/` (`logo.svg`,
  `favicon.svg`) and are not part of the screenshot set.
