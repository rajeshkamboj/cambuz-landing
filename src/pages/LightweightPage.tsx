import { Check, Zap, Feather, Layers } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';

export function LightweightPage() {
  useSeo(
    {
      title: 'Lightweight PDF Reader — Cambuz',
      description:
        'Cambuz is a lightweight PDF reader for Windows that opens and reads PDFs without bloat. No subscriptions, no editing suites, no cloud services — just a simple PDF viewer.',
      path: '/lightweight-pdf-reader/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'A lightweight PDF reader for Windows without bloat, subscriptions, or unnecessary features.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Lightweight PDF Reader' }]} />
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Lightweight</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            A PDF reader{' '}
            <span className="text-gradient">without the bloat</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Most PDF readers have grown into large applications with editing
            suites, cloud services, and subscription tiers. Cambuz takes a
            different approach — it focuses on reading. No bloat. No
            subscriptions. Just PDFs.
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

      {/* Why lightweight */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why lightweight"
            title="What a lightweight PDF reader means"
            align="left"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Feather,
                title: 'Focused on reading',
                desc: 'Cambuz does one thing well: displaying PDF documents. No toolbars full of features you never use.',
              },
              {
                icon: Layers,
                title: 'No unnecessary layers',
                desc: 'No cloud sync, no account login, no in-app store. Just a desktop application that opens files from your computer.',
              },
              {
                icon: Zap,
                title: 'Gets out of the way',
                desc: 'Open a PDF. Read it. Search it. Print it. Get back to work. That is the entire philosophy.',
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

      {/* What's included */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Included"
            title="What Cambuz includes"
            align="left"
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'PDF viewing with page navigation',
              'Zoom and fit modes',
              'Full-text search with result navigation',
              'Text selection and clipboard copying',
              'Print preview and printing',
              'Hindi and Punjabi document display',
              'Thumbnail sidebar for page jumping',
              'Portable build for USB drives',
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

      {/* What's not included */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Not included"
            title="What Cambuz deliberately does not include"
            align="left"
          />
          <p className="mt-6 text-text-secondary leading-relaxed">
            Keeping Cambuz lightweight means leaving things out. These are not
            missing features — they are intentional choices.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'No subscription or paid tier',
              'No cloud storage or file upload',
              'No account or sign-in required',
              'No PDF editing or annotation tools',
              'No OCR (optical character recognition)',
              'No browser plugin or web extension',
              'No advertising or promotional content',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface/20 border border-border-default"
              >
                <span className="text-text-secondary">—</span>
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Screenshot
            alt="Cambuz PDF Reader lightweight interface showing a clean reading view without clutter"
            caption="The Cambuz reading interface — clean and focused"
            frame="app"
            lazy
          />
        </div>
      </section>

      <CTASection
        title="Try the lightweight PDF reader"
        description="Download Cambuz for Windows. Free, no subscription, no bloat."
      />
    </>
  );
}
