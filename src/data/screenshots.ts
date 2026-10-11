/**
 * Single source of truth for product screenshot paths.
 *
 * Files live in `/public/screenshots/` and are served from the site root:
 *   public/screenshots/feature-search.png  ->  /screenshots/feature-search.png
 *
 * The full drop-in list (file names, sizes, which slot uses each one) is in
 * `docs/screenshots.md`. If a file is missing, `<Screenshot>` falls back to its
 * placeholder art (and logs the expected path in dev), so the site never shows
 * a broken image while assets are still being added.
 */
export const screenshots = {
  /** Home page hero visual. */
  heroReadingView: '/screenshots/hero-reading-view.png',

  /** Feature showcase visuals, keyed by feature id in `src/data/features.ts`. */
  features: {
    reading: '/screenshots/feature-reading.png',
    search: '/screenshots/feature-search.png',
    selection: '/screenshots/feature-selection.png',
    print: '/screenshots/feature-print.png',
    languages: '/screenshots/feature-languages.png',
    desktop: '/screenshots/feature-desktop.png',
  },

  /** Standalone landing pages. */
  pages: {
    windows: '/screenshots/page-windows-reading-view.png',
    lightweight: '/screenshots/page-lightweight-reading-view.png',
    offline: '/screenshots/page-offline-local-file.png',
    print: '/screenshots/page-print-preview.png',
    hindi: '/screenshots/page-hindi-devanagari.png',
  },
} as const;

export type FeatureScreenshotId = keyof typeof screenshots.features;

/** Look up a feature visual by the feature's `id` in `src/data/features.ts`. */
export function featureScreenshot(id: string): string | undefined {
  return (screenshots.features as Record<string, string>)[id];
}
