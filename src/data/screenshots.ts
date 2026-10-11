/**
 * Single source of truth for product screenshot paths.
 *
 * Files live in `/public/screenshots/` and are served from the site root:
 *   public/screenshots/feature-search.webp  ->  /screenshots/feature-search.webp
 *
 * All assets are 2048×1280 (16:10) WebP, which matches the `<Screenshot>`
 * frame exactly — nothing is cropped or letterboxed. See `docs/screenshots.md`
 * for what each image shows and which slot uses it.
 *
 * The images already include the real application window (title bar and
 * toolbar), so `<Screenshot>` drops its decorative window chrome when a real
 * image is present and only draws it for the fallback placeholder.
 */
export const screenshots = {
  /** Home page hero visual. */
  heroReadingView: '/screenshots/hero-reading-view.webp',

  /** Feature showcase visuals, keyed by feature id in `src/data/features.ts`. */
  features: {
    reading: '/screenshots/feature-reading.webp',
    search: '/screenshots/feature-search.webp',
    selection: '/screenshots/feature-text-selection.webp',
    print: '/screenshots/feature-print-preview.webp',
    languages: '/screenshots/feature-hindi.webp',
    desktop: '/screenshots/welcome-screen.webp',
  },

  /** Standalone landing pages. */
  pages: {
    windows: '/screenshots/theme-light.webp',
    lightweight: '/screenshots/lightweight-clean-view.webp',
    offline: '/screenshots/hero-reading-view.webp',
    print: '/screenshots/feature-print-preview.webp',
    hindi: '/screenshots/feature-hindi.webp',
    punjabi: '/screenshots/feature-punjabi.webp',
  },
} as const;

export type FeatureScreenshotId = keyof typeof screenshots.features;

/** Look up a feature visual by the feature's `id` in `src/data/features.ts`. */
export function featureScreenshot(id: string): string | undefined {
  return (screenshots.features as Record<string, string>)[id];
}
