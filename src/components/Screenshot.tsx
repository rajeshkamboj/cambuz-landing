import { useState, useEffect } from 'react';

interface ScreenshotProps {
  src?: string;
  alt: string;
  caption?: string;
  frame?: 'app' | 'browser' | 'none';
  lightbox?: boolean;
  className?: string;
  lazy?: boolean;
}

/**
 * Reusable screenshot component for displaying Cambuz product visuals.
 *
 * Until genuine screenshots are supplied, this component renders a
 * clearly-marked placeholder with the correct dimensions and framing.
 * To replace: add image files to /public/screenshots/ and pass the
 * path via the `src` prop. The component handles the rest.
 *
 * NOTE: Placeholder labels are only shown during development and are
 * not rendered in production. Set src to a real image path to display
 * actual screenshots.
 */
export function Screenshot({
  src,
  alt,
  caption,
  frame = 'app',
  lightbox = false,
  className = '',
  lazy = true,
}: ScreenshotProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const frameClasses = {
    app: 'rounded-xl border border-border-default bg-surface overflow-hidden shadow-2xl',
    browser:
      'rounded-xl border border-border-default bg-surface overflow-hidden shadow-2xl',
    none: 'rounded-lg overflow-hidden',
  };

  const browserBar = (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-default bg-surface-2">
      <span className="w-3 h-3 rounded-full bg-red-500/70" />
      <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
      <span className="w-3 h-3 rounded-full bg-green-500/70" />
      <div className="flex-1 ml-3 h-5 rounded-md bg-bg/50 border border-border-default" />
    </div>
  );

  const appBar = (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border-default bg-surface-2">
      <span className="text-xs font-medium text-text-secondary">Cambuz PDF Reader</span>
      <div className="flex-1" />
      <span className="w-4 h-4 rounded bg-border-default" />
      <span className="w-4 h-4 rounded bg-border-default" />
    </div>
  );

  return (
    <>
      <figure
        className={`group relative ${frameClasses[frame]} ${className}`}
        role="img"
        aria-label={alt}
      >
        {frame === 'browser' && browserBar}
        {frame === 'app' && appBar}

        <div className="relative aspect-[16/10] bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={alt}
              loading={lazy ? 'lazy' : 'eager'}
              className="w-full h-full object-cover"
              onClick={() => lightbox && setLightboxOpen(true)}
              role={lightbox ? 'button' : undefined}
              tabIndex={lightbox ? 0 : undefined}
              onKeyDown={
                lightbox
                  ? (e) => e.key === 'Enter' && setLightboxOpen(true)
                  : undefined
              }
            />
          ) : (
            <PlaceholderVisual alt={alt} />
          )}
        </div>

        {caption && (
          <figcaption className="px-5 py-3 text-sm text-text-secondary border-t border-border-default bg-surface-2/50">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightbox && lightboxOpen && imageSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 cursor-pointer"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — enlarged view`}
        >
          <img
            src={imageSrc}
            alt={alt}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface border border-border-default text-text-main hover:bg-surface-2 flex items-center justify-center transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Development placeholder for screenshots.
 * Renders an abstract PDF-reader-like composition.
 * In production with real `src` images, this is never shown.
 */
function PlaceholderVisual({ alt }: { alt: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 blur-3xl opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, #367CF6 0%, transparent 70%)',
          }}
        />
        {/* Mock document */}
        <div className="relative rounded-lg bg-[#1a2336] border border-border-default p-6 shadow-xl">
          <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-border-default">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <div className="flex-1 ml-2 h-4 rounded bg-bg/40" />
          </div>
          <div className="space-y-2.5">
            <div className="h-3 w-3/4 rounded bg-text-secondary/20" />
            <div className="h-3 w-full rounded bg-text-secondary/15" />
            <div className="h-3 w-full rounded bg-text-secondary/15" />
            <div className="h-3 w-5/6 rounded bg-text-secondary/15" />
            <div className="h-3 w-2/3 rounded bg-text-secondary/10" />
            <div className="h-3 w-full rounded bg-text-secondary/15" />
            <div className="h-3 w-4/5 rounded bg-text-secondary/15" />
            <div className="h-3 w-1/2 rounded bg-text-secondary/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
