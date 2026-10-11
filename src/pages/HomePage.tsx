import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  MousePointer2,
  Printer,
  Languages,
  Monitor,
  Check,
  ArrowRight,
  Shield,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig, downloadArtifacts, formatMiB } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { SectionHeading } from '@/components/SectionHeading';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTASection } from '@/components/CTASection';
import { features, comparisonRows } from '@/data/features';
import { screenshots, featureScreenshot } from '@/data/screenshots';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Search,
  MousePointer2,
  Printer,
  Languages,
  Monitor,
};

const trustItems = [
  { icon: Check, label: 'Free to use' },
  { icon: Monitor, label: 'Desktop application' },
  { icon: Shield, label: 'No subscription required' },
  { icon: FolderOpen, label: 'Installer & portable option' },
];

/** The Windows x64 installer — the same file the release page serves. */
const recommendedDownload = downloadArtifacts.find((artifact) => artifact.recommended)!;

export function HomePage() {
  useSeo(
    {
      title: siteConfig.name,
      description:
        'Cambuz is a free desktop PDF reader for Windows. Open, read, search, select, and print PDFs without subscriptions, bloat, or unnecessary complexity.',
      path: '/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: siteConfig.description,
      author: {
        '@type': 'Person',
        name: siteConfig.creator,
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.brand,
        url: siteConfig.brandWebsite,
      },
      license: siteConfig.licenseUrl,
    }
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div
          className="ambient-blue w-[500px] h-[500px] bg-primary/10 top-0 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/60 border border-border-default text-sm text-text-secondary mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Free desktop PDF reader for Windows</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-main tracking-tight animate-fade-in-up leading-[1.1]">
              Your PDFs.
              <br />
              <span className="text-gradient">Nothing in the way.</span>
            </h1>

            {/* Subhead */}
            <p
              className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Meet Cambuz, a free desktop PDF reader built for people who want to
              open, read, search, and print without unnecessary complexity.
            </p>

            {/* CTAs */}
            <div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <ButtonLink
                to={recommendedDownload.url}
                external
                size="lg"
                icon="download"
              >
                Download for Windows
              </ButtonLink>
              <ButtonLink
                to="/features/"
                size="lg"
                variant="secondary"
                icon="arrow"
              >
                Explore Features
              </ButtonLink>
            </div>

            {/* Honest download detail: size, pre-release status, other builds */}
            <p
              className="mt-4 text-sm text-text-secondary animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              {formatMiB(recommendedDownload.bytes)} installer · v
              {siteConfig.version} pre-release, unsigned ·{' '}
              <Link
                to="/download/"
                className="text-accent hover:text-primary transition-colors"
              >
                portable, Linux and macOS builds
              </Link>
            </p>

            {/* Trust items */}
            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div
            className="mt-16 lg:mt-20 max-w-5xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Screenshot
              src={screenshots.heroReadingView}
              alt="Cambuz PDF Reader application window showing a PDF document open in the reading view"
              caption="The Cambuz reading interface"
              frame="app"
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features showcase */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to read a PDF"
            description="No bloat. No subscriptions. Just the tools that matter when you need to open, read, search, and print a document."
          />

          <div className="mt-20 space-y-32">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || BookOpen;
              const reversed = i % 2 === 1;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                  {/* Text */}
                  <div className={reversed ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="w-5 h-5 text-primary" />
                      </span>
                      <span className="text-sm font-semibold text-primary tracking-wide">
                        Feature {i + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main tracking-tight">
                      {feature.headline}
                    </h3>
                    <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {feature.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-text-secondary"
                        >
                          <Check
                            className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                            strokeWidth={2}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={reversed ? 'lg:order-1' : ''}>
                    <Screenshot
                      src={featureScreenshot(feature.id)}
                      alt={feature.screenshotAlt}
                      caption={feature.screenshotCaption}
                      frame="app"
                      lazy
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Cambuz — editorial comparison */}
      <section className="py-24 relative overflow-hidden" id="why-cambuz">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
        <div
          className="ambient-blue w-[400px] h-[400px] bg-primary/5 top-1/3 -right-48"
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Cambuz"
            title="Not every PDF needs a productivity suite"
            description="Sometimes you just need to open a document, find a paragraph, copy a few lines, or print a page. Cambuz focuses on that everyday workflow."
          />

          {/* Comparison table */}
          <div className="mt-16 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary">
                    Feature
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-primary bg-primary/5 rounded-t-xl">
                    Cambuz
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary">
                    Adobe Reader
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary">
                    Foxit Reader
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary">
                    Sumatra
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-border-default"
                  >
                    <td className="p-4 text-sm font-medium text-text-main">
                      {row.feature}
                    </td>
                    <td className="p-4 text-sm text-text-main bg-primary/5">
                      {row.cambuz}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {row.adobeReader}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {row.foxit}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {row.sumatra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-text-secondary">
            Comparison reflects publicly available information as of 2025. No
            claims about competitors' memory use, advertising, privacy, or
            pricing are made beyond what is stated above.
          </p>

          <div className="mt-12 text-center">
            <ButtonLink to="/free-pdf-reader-alternatives/" variant="secondary" icon="arrow">
              See how Cambuz compares
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Everything you might want to know about Cambuz PDF Reader."
          />
          <div className="mt-12">
            <FAQAccordion />
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/about/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              Learn more about Cambuz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
