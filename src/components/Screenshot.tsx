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
 * Image files live in `/public/screenshots/` and are referenced through the
 * map in `src/data/screenshots.ts`. The drop-in file list (names, sizes,
 * which slot uses each one) is in `docs/screenshots.md`.
 *
 * If `src` is omitted, or the file has not been added yet, this component
 * renders a clearly-marked placeholder with the correct dimensions and
 * framing — it never shows a broken image. In development it also logs the
 * expected file path so it is obvious what to drop in.
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
  const [failed, setFailed] = useState(false);

  // Reset the failure state when a different src is supplied (e.g. HMR).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;

  function handleImageError() {
    setFailed(true);
    if (import.meta.env.DEV) {
      console.warn(
        `[Screenshot] No image at public${src}. Add the file (see docs/screenshots.md) — showing placeholder instead.`
      );
    }
  }

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
        {/*
          The decorative window chrome is only drawn for the fallback
          placeholder. Real screenshots already contain the application window,
          so drawing it on top would produce a double title bar.
        */}
        {!showImage && frame === 'browser' && browserBar}
        {!showImage && frame === 'app' && appBar}

        <div className="relative aspect-[16/10] bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
          {showImage ? (
            <img
              src={src}
              alt={alt}
              loading={lazy ? 'lazy' : 'eager'}
              decoding="async"
              onError={handleImageError}
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
            <PlaceholderVisual alt={alt} expectedSrc={src} />
          )}
        </div>

        {caption && (
          <figcaption className="px-5 py-3 text-sm text-text-secondary border-t border-border-default bg-surface-2/50">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightbox && lightboxOpen && showImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 cursor-pointer"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — enlarged view`}
        >
          <img
            src={src}
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
 * Renders an abstract PDF-reader-like composition plus, in dev only, the
 * file path that should be dropped into /public/screenshots/.
 */
function PlaceholderVisual({
  alt,
  expectedSrc,
}: {
  alt: string;
  expectedSrc?: string;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6">
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

      {import.meta.env.DEV && (
        <p className="max-w-md text-center text-[11px] leading-relaxed font-mono text-text-secondary/60 break-all">
          {expectedSrc
            ? `Awaiting public${expectedSrc} — ${alt}`
            : `No src set — ${alt}`}
        </p>
      )}
    </div>
  );
}
