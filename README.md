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

Product visuals are rendered through `<Screenshot>` and served from
`public/screenshots/`. **Drop the image files in with the names listed in
[docs/screenshots.md](docs/screenshots.md) and they appear — no code change
required.** Paths are declared in
[`src/data/screenshots.ts`](src/data/screenshots.ts). Missing files fall back to
a correctly-sized placeholder rather than a broken image.
