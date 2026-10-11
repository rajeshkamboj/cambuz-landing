import { Check, Monitor, Download, Zap, Shield } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { faqItems } from '@/data/faq';
import { screenshots } from '@/data/screenshots';

const windowsFaq = faqItems.filter((_, i) => [0, 1, 2, 3, 4, 5, 10].includes(i));

export function WindowsPage() {
  useSeo(
    {
      title: 'Free PDF Reader for Windows — Cambuz',
      description:
        'Download a free PDF reader for Windows 10 and Windows 11. Cambuz is a lightweight desktop PDF viewer with search, text selection, and printing. No subscription required.',
      path: '/free-pdf-reader-windows/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows 10, Windows 11',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free PDF reader for Windows 10 and Windows 11 with reading, search, text selection, and printing.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Free PDF Reader for Windows' }]} />
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Windows</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            Free PDF reader for{' '}
            <span className="text-gradient">Windows</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Cambuz is a free desktop PDF reader for Windows 10 and Windows 11.
            Open, read, search, select text, and print PDFs without
            subscriptions or unnecessary complexity. Available as an installer
            and a portable executable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <ButtonLink to="/download/" size="lg" icon="download">
              Download for Windows
            </ButtonLink>
            <ButtonLink to="/features/" size="lg" variant="secondary">
              See all features
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Key benefits */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                title: 'Native Windows app',
                desc: 'Runs as a proper desktop application on Windows 10 and 11, not a browser tab or upload form.',
              },
              {
                icon: Zap,
                title: 'Installer or portable',
                desc: 'Choose the installer for Start menu integration, or the portable build that runs without installation.',
              },
              {
                icon: Shield,
                title: 'Free and open source',
                desc: 'No subscription, no trial period, no feature paywall. Released under the MIT license.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-surface/50 border border-border-default card-glow-hover transition-all duration-200"
              >
                <item.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-base font-semibold text-text-main mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="What you can do with Cambuz on Windows"
            align="left"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Open and read PDF files of any size',
              'Navigate pages with thumbnails and page controls',
              'Zoom in and out with fit-width and fit-page modes',
              'Search for text across the entire document',
              'Select and copy text to the clipboard',
              'Print documents with print preview and page range selection',
              'Read Hindi (Devanagari) and Punjabi (Gurmukhi) PDFs',
              'Use the portable version from a USB drive',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded-lg bg-surface/30 border border-border-default"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Screenshot
            src={screenshots.pages.windows}
            alt="Cambuz PDF Reader running on Windows showing a document in the reading view"
            caption="Cambuz PDF Reader on Windows"
            frame="app"
            lazy
          />
        </div>
      </section>

      {/* Windows installation */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Installation"
            title="Installing Cambuz on Windows"
            align="left"
          />
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
              <h3 className="text-base font-semibold text-text-main mb-3">
                Installer
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Download the installer, double-click to run it, and follow the
                setup wizard. Cambuz will be added to your Start menu and can be
                set as your default PDF reader.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
              <h3 className="text-base font-semibold text-text-main mb-3">
                Portable
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Download the portable executable and run it directly. No
                installation is required, making it ideal for USB drives or
                environments where you cannot install software.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <h3 className="text-base font-semibold text-yellow-400 mb-2">
                About SmartScreen warnings
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Cambuz builds are currently unsigned. Windows SmartScreen may
                show a warning. Click "More info" then "Run anyway" to proceed.
                Never disable Windows security protections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Windows FAQ"
            align="left"
          />
          <div className="mt-8">
            <FAQAccordion items={windowsFaq} />
          </div>
        </div>
      </section>

      <CTASection
        title="Download Cambuz for Windows"
        description="Free, no subscription, no bloat. Installer and portable builds available."
      />
    </>
  );
}
