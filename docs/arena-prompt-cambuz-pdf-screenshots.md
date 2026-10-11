# Prompt: capture live screenshots in the cambuz-pdf repo

Paste everything below the line into Arena Agent Mode with the
`rajeshkamboj/cambuz-pdf` repo selected.

---

Capture genuine, live screenshots of Cambuz PDF Reader for the product landing site (`rajeshkamboj/cambuz-landing`, which has 10 placeholder screenshot slots) and for the "📸 Screenshots" section of this repo's README.

## Hard rules
- Real captures of the real, packaged app only. No mockups, no AI-generated or redrawn images, no compositing or retouching. Only crop, resize and format conversion are allowed.
- Use only the bundled PDFs in `samples/`. Nothing personal may be visible. If the status bar or title shows a full file path, make sure it contains no personal username.
- Don't change the app's behaviour or UI to make a screenshot look better. If you hit a visual bug, report it; don't hide it.
- Never invent data: printer names, page counts, match counts and so on must be whatever the app really shows.
- `npm test` and the existing `Desktop builds` workflow must stay green. Don't weaken `desktop-build.yml`.

## Approach (build on the existing tooling)
1. Read `scripts/smoke-test-packaged.mjs`. It already launches the packaged exe with `--remote-debugging-port` and drives the real window over CDP (real `Input.dispatchMouseEvent`/`dispatchKeyEvent`, `Page.captureScreenshot`). Write `scripts/capture-screenshots.mjs` the same way. Reuse helpers where it's clean, but don't change what the smoke test does.
2. Add `.github/workflows/screenshots.yml`:
   - `runs-on: windows-latest`; triggers: `workflow_dispatch`, plus `push` to `arena/**` when the capture script or this workflow changes.
   - Steps: checkout, Node 22, `npm ci`, build the unpacked Windows app the same way `desktop-build.yml` does, run the capture script against `dist/win-unpacked/Cambuz PDF Reader.exe`, then upload an artifact named `marketing-screenshots` (PNG masters + log).
   - Final images must come from this Windows run (real Windows fonts and rendering). You may iterate on Linux under `xvfb-run` to debug the script, but don't ship Linux captures.
3. Push, `gh run watch`, `gh run download <id> -n marketing-screenshots`, then open every PNG with read_file and check it against its spec below. Fix and re-run until all of them pass.

## Capture settings (content-only shots)
- Before opening any document, apply `Emulation.setDeviceMetricsOverride { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false }`, so each capture is 2880×1800 (16:10). Confirm `window.devicePixelRatio === 2` and that PDF text is crisp: the page canvas must re-render after the override.
- Capture only the web contents (no Windows title bar or menu bar). The website draws its own app title bar around these images.
- Dark theme (the app default) unless stated otherwise.
- Before each capture, wait until everything has settled: page canvas and thumbnails fully rendered, no spinners, toasts, tooltips or hover states, and the pointer parked off the toolbar.
- First check which sample has several pages of real headings and paragraphs (probably `cambuz-demo.pdf`, otherwise `multilingual.pdf`). Use it for the reading, search, selection and print shots.

## Shot list (file name → exact state)
1. `hero-reading-view`: best multi-page sample open, sidebar open on **Thumbnails**, page 1, toolbar clearly showing page `X / Y` and zoom %.
2. `feature-reading`: Thumbnails tab open, navigated to page 2 or 3 (current thumbnail highlighted), **Fit width** active.
3. `feature-search`: Ctrl+F, search for a word that appears several times on the visible page. Highlights visible, current match on screen, counter showing the real "n of N".
4. `feature-text-selection`: select 2–4 lines of a paragraph with a real mouse drag over the text layer. The selection must be clearly visible.
5. `feature-print-preview`: Ctrl+P on the multi-page sample. Preview canvas rendered (not the placeholder), page range `1-2` with no error, and a real installed printer selected (e.g. "Microsoft Print to PDF" on the runner).
6. `feature-hindi`: `samples/hindi-sample.pdf` at 100–125% zoom, Devanagari crisp and readable.
7. `feature-punjabi`: `samples/punjabi-sample.pdf`, same framing as #6.
8. `lightweight-clean-view`: sidebar closed, no dialogs or search bar, one page centred, **Fit page**.
9. `welcome-screen`: fresh launch, welcome screen with the sample buttons. The recent-files list must be empty or contain only bundled samples.
10. `theme-light`: same state as #1 after toggling the theme button to light.

## Desktop shots with real Windows chrome (best effort)
11. `feature-desktop-windows`, 12. `windows-reading-view`, 13. `offline-local-file`: full-screen captures of the Windows desktop showing the native Cambuz window (real title bar, part of the taskbar) with a document open.
- In the workflow, try to set the runner display to 1920×1080 or larger first, size the app window to about 1440×900, then capture the screen with PowerShell (`System.Drawing` `Graphics.CopyFromScreen`).
- If the runner has no usable interactive desktop (black image, locked screen, stuck at 1024×768), don't fake it. Mark these "manual capture needed" and give me exact step-by-step instructions to take them on my own Windows PC.
- For #13, don't disable the runner's network or fake a "no internet" icon. Capture with a local file open, and note that an offline-icon version would need a manual capture.

## Outputs
- Convert the PNG masters to WebP in a temp directory outside the app's dependencies (e.g. `sharp` installed in /tmp; don't add anything to `package.json`):
  - content shots: 2048×1280, quality ~82, target ≤ 300 KB each
  - desktop shots: keep the 16:10 crop, max width 2048
- Commit the WebP files to `assets/screenshots/`. Keep the large PNG masters only in the CI artifact; don't commit them.
- Add `assets/screenshots/manifest.json` with one entry per file: `file`, `state` (what is shown), `sample`, `theme`, `width`, `height`, `bytes`, `commit`, `ciRunUrl`, `method` (`cdp-content` or `desktop-screen`).
- Update the README "📸 Screenshots" section. Replace the "no screenshots yet" text with the hero, Hindi and print-preview images and link to the folder. Keep the README's factual tone.
- Make sure the new files don't end up inside the packaged app (`check-packaged-app.mjs` / the build allowlist must still pass).

## Final report
A table of all 13 files with columns: status (captured / manual needed), pixel size, file size, sample used, plus the CI run link and commit SHA. Then list any visual bugs or problems you noticed.
