import { Check, WifiOff, Monitor, HardDrive, Lock } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { screenshots } from '@/data/screenshots';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';

export function OfflinePage() {
  useSeo(
    {
      title: 'Offline PDF Reader — Cambuz',
      description:
        'Cambuz is a desktop PDF reader that works offline. Open and read PDF files stored on your computer without an internet connection. No upload, no cloud, no browser required.',
      path: '/offline-pdf-reader/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'An offline desktop PDF reader that opens local files without an internet connection.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Offline PDF Reader' }]} />
          <div className="flex items-center gap-3 mb-4">
            <WifiOff className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Offline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            Read PDFs{' '}
            <span className="text-gradient">without the internet</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Cambuz is a desktop application that opens PDF files from your
            computer. Once installed, it does not require an internet connection
            to read, search, or print documents stored locally.
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

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A desktop tool, not another upload form"
            align="left"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                title: 'Install once',
                desc: 'Download and install Cambuz on your Windows computer. It runs as a native desktop application.',
              },
              {
                icon: HardDrive,
                title: 'Open local files',
                desc: 'Open PDF files stored on your hard drive, USB stick, or network share. No upload to any server.',
              },
              {
                icon: WifiOff,
                title: 'Work offline',
                desc: 'Reading, searching, selecting text, and printing all work without an internet connection.',
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

      {/* Offline capabilities */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="What works offline"
            align="left"
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Opening PDF files from your computer',
              'Page navigation and scrolling',
              'Zoom and fit modes',
              'Full-text search within a document',
              'Text selection and copying',
              'Printing to a local printer',
              'Viewing Hindi and Punjabi documents',
              'Using the portable build from USB',
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

      {/* Important note */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
            <div className="flex items-start gap-4">
              <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-text-main mb-2">
                  About offline use and privacy
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Cambuz is a desktop application that opens files from your
                  local filesystem. It does not require an internet connection
                  for reading, searching, or printing. We do not make blanket
                  privacy or security guarantees beyond this — your PDF files
                  are processed locally by the application on your computer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Screenshot
            src={screenshots.pages.offline}
            alt="Cambuz PDF Reader displaying a PDF document offline on a Windows desktop"
            caption="Cambuz reading a local PDF file without an internet connection"
            frame="app"
            lazy
          />
        </div>
      </section>

      <CTASection
        title="Read PDFs offline with Cambuz"
        description="Download a desktop PDF reader that works without the internet."
      />
    </>
  );
}
