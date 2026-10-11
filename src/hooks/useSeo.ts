import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  noindex?: boolean;
}

function setOrCreateTag(
  selector: string,
  attribute: string,
  value: string,
  tagName: string,
  additionalAttrs?: Record<string, string>
) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = document.createElement(tagName);
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
  if (additionalAttrs) {
    for (const [k, v] of Object.entries(additionalAttrs)) {
      el.setAttribute(k, v);
    }
  }
}

function setStructuredData(jsonld: object) {
  let script = document.head.querySelector(
    'script[data-structured-data="jsonld"]'
  ) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'jsonld');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonld);
}

export function useSeo(meta: SeoMeta, jsonLd?: object) {
  useEffect(() => {
    const fullUrl = `${siteConfig.productionDomain}${meta.path}`;
    const fullTitle =
      meta.title === siteConfig.name
        ? `${siteConfig.name} — ${siteConfig.positioning}`
        : `${meta.title} — ${siteConfig.name}`;

    document.title = fullTitle;

    setOrCreateTag('meta[name="description"]', 'name', meta.description, 'meta');
    setOrCreateTag('link[rel="canonical"]', 'href', fullUrl, 'link');

    setOrCreateTag('meta[property="og:title"]', 'content', fullTitle, 'meta');
    setOrCreateTag(
      'meta[property="og:description"]',
      'content',
      meta.description,
      'meta'
    );
    setOrCreateTag('meta[property="og:url"]', 'content', fullUrl, 'meta');
    setOrCreateTag(
      'meta[property="og:type"]',
      'content',
      meta.ogType || 'website',
      'meta'
    );
    setOrCreateTag(
      'meta[property="og:site_name"]',
      'content',
      siteConfig.name,
      'meta'
    );

    // Social card: absolute URL + dimensions so scrapers never have to guess.
    const socialImage = `${siteConfig.productionDomain}/social/og-image.png`;
    setOrCreateTag('meta[property="og:image"]', 'content', socialImage, 'meta');
    setOrCreateTag('meta[property="og:image:type"]', 'content', 'image/png', 'meta');
    setOrCreateTag('meta[property="og:image:width"]', 'content', '1200', 'meta');
    setOrCreateTag('meta[property="og:image:height"]', 'content', '630', 'meta');

    setOrCreateTag('meta[name="twitter:card"]', 'content', 'summary_large_image', 'meta');
    setOrCreateTag('meta[name="twitter:image"]', 'content', socialImage, 'meta');
    setOrCreateTag('meta[name="twitter:title"]', 'content', fullTitle, 'meta');
    setOrCreateTag(
      'meta[name="twitter:description"]',
      'content',
      meta.description,
      'meta'
    );

    if (meta.noindex) {
      setOrCreateTag('meta[name="robots"]', 'content', 'noindex, nofollow', 'meta');
    } else {
      const existing = document.head.querySelector('meta[name="robots"]');
      if (existing) existing.remove();
    }

    if (jsonLd) {
      setStructuredData(jsonLd);
    } else {
      const existing = document.head.querySelector(
        'script[data-structured-data="jsonld"]'
      );
      if (existing) existing.remove();
    }
  }, [meta, jsonLd]);
}
