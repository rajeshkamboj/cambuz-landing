# Screenshot & image audit — Cambuz landing site

Audited: commit `384319a` ("Website added"), 2026-10-11.
App reference: `rajeshkamboj/cambuz-pdf` @ `main` (v1.1.0).

## Summary

| | Count |
|---|---|
| `<Screenshot>` renders across the site | **18** (on 8 pages) |
| Unique image slots | **9** |
| Slots with a real image (`src` set) | **0** |
| Files in `public/screenshots/` | **0** (folder does not exist) |

Every screenshot on the site currently shows the grey "mock document" placeholder.
**The placeholder ships to production:** the comment in `Screenshot.tsx` says it is
dev-only, but nothing in the code checks the environment (verified with `npm run build`).

## Shot list — app screenshots needed

Save each one to `public/screenshots/` using the filename shown. Sample PDFs are in
`cambuz-pdf/samples/`.

| # | File | Used on (page → section) | What to capture in the app |
|---|---|---|---|
| 1 | `hero-reading-view.webp` | `/` → hero (largest image on the site, 1024 px wide) | `cambuz-demo.pdf` open, thumbnail sidebar visible, toolbar showing page number + zoom %. Your best all-round shot. |
| 2 | `feature-reading.webp` | `/` + `/features/` → "Just you and the document." | Page navigation and zoom: sidebar **Thumbnails** tab open, on page 2–3, *Fit width* active. Dark theme (the bullets mention a "dark reading surface"). |
| 3 | `feature-search.webp` | `/` + `/features/` → "Search less. Find more." | Ctrl+F search bar open with a common word typed, highlights visible on the page, match counter showing e.g. "3 of 12". |
| 4 | `feature-text-selection.webp` | `/` + `/features/` → "Select. Copy. Keep moving." | A paragraph selected (blue highlight) in `cambuz-demo.pdf`. Right-click menu with **Copy** optional (the native menu needs a manual screenshot). |
| 5 | `feature-print-preview.webp` | `/` + `/features/` → "From PDF to paper." **and** `/print-pdf-windows/` | Ctrl+P print dialog: preview canvas rendered, **Page range** filled in (e.g. `1-3`), a printer selected in the dropdown. |
| 6 | `feature-hindi.webp` | `/` + `/features/` → "Made for the documents you actually read." **and** `/read-hindi-punjabi-pdf/` | `hindi-sample.pdf` open, Devanagari text clearly readable at about 100–125% zoom. |
| 7 | `feature-desktop-windows.webp` | `/` + `/features/` → "A desktop tool, not another upload form." | The app as a native Windows window: title bar, part of the taskbar/desktop, or the Start-menu entry. Proves it's a desktop app, not a browser tab. |
| 8 | `windows-reading-view.webp` | `/free-pdf-reader-windows/` | The app on Windows 10/11 with a document open. Can reuse #7 if you want fewer images. |
| 9 | `offline-local-file.webp` | `/offline-pdf-reader/` | A local PDF open, ideally with Windows' "No internet" network icon visible in the taskbar, or the status bar showing the local file path. |
| 10 | `lightweight-clean-view.webp` | `/lightweight-pdf-reader/` | Minimal view: sidebar closed, no dialogs, one clean page. Can reuse #1 if needed. |

**Minimum set:** 7 images (#1–#7), with #8 and #9 reusing #7 and #10 reusing #1.
**Ideal set:** all 10, so the SEO landing pages aren't showing duplicate images.

### Optional extras worth capturing

The site doesn't use these yet, but they back up claims made in the copy:

- `feature-punjabi.webp`: `punjabi-sample.pdf` (Gurmukhi). The Hindi/Punjabi page only shows Hindi right now.
- `welcome-screen.webp`: the welcome screen with sample buttons and the recent-files list.
- `theme-light.webp`: the same document as #1 in light theme.

The `cambuz-pdf` README also asks for real screenshots of the welcome screen, a Hindi/Punjabi document
with the sidebar open, and the print dialog. #5, #6 and `welcome-screen` cover that.

## Capture specs

- **Aspect ratio: 16:10.** Each slot is a fixed `aspect-[16/10]` box using `object-cover`, so
  other ratios get cropped. The app's default window is **1200×800 (3:2)**, which would lose
  about 4% at the top and bottom. Resize the window to **1440×900** or **1280×800** before capturing.
- **Resolution:** at least **2048×1280 px** for #1 (hero, 2× retina at 1024 px). At least **1800×1125 px**
  for the rest. Easiest way: capture at 150–200% Windows display scaling.
- **Window chrome:** with `frame="app"`, the component already draws a fake
  "Cambuz PDF Reader" title bar above the image. For #1–#6 and #10, capture **only the
  window contents** (no Windows title bar or menu bar), otherwise there will be two title bars.
  For #7–#9, the real Windows chrome is the whole point, so keep it and switch those
  slots to `frame="none"` (code change).
- **Format:** export as **WebP** (quality around 80–85), aiming for under 250 KB each. Keep the PNG masters outside the repo.
- **Content:** use only the bundled sample PDFs. No personal or copyrighted documents.
- **Theme:** keep it consistent. Dark matches the site (`#0B1020`), except for the optional light-theme shot.

## Other image problems found

| Priority | Issue | Where | Fix |
|---|---|---|---|
| High | Placeholder ships to production. The code comment says otherwise. | `src/components/Screenshot.tsx` | Add the real images, or hide the figure when `src` is missing in production. |
| High | No way to pass an image to the 6 feature slots: the `Feature` type has no image-path field. | `src/data/features.ts`, `HomePage.tsx`, `FeaturesPage.tsx` | Add `screenshotSrc` to each feature and pass `src={feature.screenshotSrc}`. |
| High | Social preview image is an **SVG**. Facebook, X, LinkedIn and WhatsApp generally won't show it. | `index.html` (`og:image`, `twitter:image`) → `public/og-image.svg` | Create `public/og-image.png` at **1200×630**, ideally with screenshot #1 in it. |
| Medium | `og:image` is a relative path (`/og-image.svg`). Crawlers need an absolute URL. `useSeo` sets `og:url` but never `og:image`. | `index.html`, `src/hooks/useSeo.ts` | Use `https://cambuz.pixldot.com/og-image.png` and set it in `useSeo`. |
| Medium | The real app icon (`cambuz-pdf/assets/icon-master.png`, a blue "C" around a PDF page) isn't used anywhere. The header uses the generic Lucide `FileText` icon and the favicon is a separately drawn SVG. | `src/components/Logo.tsx`, `public/favicon.svg` | Export the app icon as favicon (SVG/32 px PNG/ICO), `apple-touch-icon.png` (180 px) and a header logo. |
| Low | `public/logo.svg` isn't referenced anywhere. | `public/` | Use it or delete it. |
| Low | Lightbox support exists but no slot turns it on (`lightbox` prop). | All `<Screenshot>` uses | Turn it on for the hero and feature shots once real images are in. |
| Low | `<figure role="img" aria-label>` wraps an `<img alt>`, so screen readers announce the same text twice and skip the caption. | `Screenshot.tsx` | Remove `role`/`aria-label` from `<figure>` when a real `<img>` is shown. |

## Checklist

- [ ] 1 `hero-reading-view.webp`
- [ ] 2 `feature-reading.webp`
- [ ] 3 `feature-search.webp`
- [ ] 4 `feature-text-selection.webp`
- [ ] 5 `feature-print-preview.webp`
- [ ] 6 `feature-hindi.webp`
- [ ] 7 `feature-desktop-windows.webp`
- [ ] 8 `windows-reading-view.webp` (or reuse 7)
- [ ] 9 `offline-local-file.webp` (or reuse 7)
- [ ] 10 `lightweight-clean-view.webp` (or reuse 1)
- [ ] `og-image.png` 1200×630
- [ ] Favicon / apple-touch-icon / header logo from the real app icon
