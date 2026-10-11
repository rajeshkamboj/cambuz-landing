import { Link } from 'react-router-dom';
import { FileText, Github, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features/' },
      { label: 'Download', to: '/download/' },
      { label: 'Free PDF Reader for Windows', to: '/free-pdf-reader-windows/' },
      { label: 'Lightweight PDF Reader', to: '/lightweight-pdf-reader/' },
      { label: 'Offline PDF Reader', to: '/offline-pdf-reader/' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Read Hindi & Punjabi PDFs', to: '/read-hindi-punjabi-pdf/' },
      { label: 'Print PDF on Windows', to: '/print-pdf-windows/' },
      { label: 'Free PDF Reader Alternatives', to: '/free-pdf-reader-alternatives/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Cambuz', to: '/about/' },
      { label: 'PixlDot', to: siteConfig.brandWebsite, external: true },
      { label: 'GitHub Repository', to: siteConfig.githubRepo, external: true },
      { label: 'License (MIT)', to: siteConfig.licenseUrl, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg relative overflow-hidden">
      <div
        className="ambient-blue w-96 h-96 bg-primary/5 -top-48 left-1/4"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface border border-border-default">
                <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
              </span>
              <span className="text-lg font-semibold text-text-main">Cambuz</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {siteConfig.positioning}
            </p>
            <p className="text-xs text-text-secondary">
              Built by {siteConfig.creator} under{' '}
              <a
                href={siteConfig.brandWebsite}
                className="text-accent hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.brand}
              </a>
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-text-main mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-text-main transition-colors inline-flex items-center gap-1.5"
                      >
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-text-secondary hover:text-text-main transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} {siteConfig.brand}. Cambuz PDF Reader is
            released under the MIT license.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-main transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.brandWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-main transition-colors"
              aria-label="PixlDot website"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
