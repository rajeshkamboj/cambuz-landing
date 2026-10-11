import { Check, Printer, FileText, Settings } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';

export function PrintPage() {
  useSeo(
    {
      title: 'Print PDF on Windows — Cambuz PDF Reader',
      description:
        'Print PDF documents on Windows with Cambuz PDF Reader. Print preview, page range selection, and support for any installed printer. Free, no subscription required.',
      path: '/print-pdf-windows/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free PDF reader for Windows with print preview, page range selection, and printing support.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Print PDF on Windows' }]} />
          <div className="flex items-center gap-3 mb-4">
            <Printer className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Printing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            From PDF{' '}
            <span className="text-gradient">to paper</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Cambuz PDF Reader includes a standard print preview and printing
            workflow for Windows. Print all pages or a specific page range to
            any installed printer — directly from the reader, without opening
            another application.
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

      {/* How printing works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Printing"
            title="How printing works in Cambuz"
            align="left"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Open the document',
                desc: 'Open any PDF file in Cambuz. The print option is available from the menu or keyboard shortcut.',
              },
              {
                icon: Settings,
                title: 'Preview and configure',
                desc: 'A print preview shows how the document will appear on paper. Select your printer, page range, and paper size.',
              },
              {
                icon: Printer,
                title: 'Send to paper',
                desc: 'Click print and the document is sent to your selected printer. Works with any installed Windows printer.',
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

      {/* Print features */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="What the print workflow includes"
            align="left"
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Print preview before committing to paper',
              'Select specific pages or page ranges',
              'Choose from installed Windows printers',
              'Standard paper size options',
              'Portrait and landscape orientation',
              'Print all pages or a custom range',
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

      {/* Honest note */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
            <h3 className="text-base font-semibold text-text-main mb-2">
              About printer compatibility
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Cambuz uses the standard Windows printing system, which means it
              works with any printer that has Windows drivers installed. We do
              not claim that every printer model or page layout has been
              tested. If you encounter a printing issue, it may be related to
              your printer driver or the specific PDF document.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Screenshot
            alt="Cambuz PDF Reader print preview dialog showing page range and printer selection options"
            caption="Print preview with page range selection in Cambuz"
            frame="app"
            lazy
          />
        </div>
      </section>

      <CTASection
        title="Print PDFs the simple way"
        description="Download Cambuz for Windows. Free, no subscription, with built-in printing."
      />
    </>
  );
}
