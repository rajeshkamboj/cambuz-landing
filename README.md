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
