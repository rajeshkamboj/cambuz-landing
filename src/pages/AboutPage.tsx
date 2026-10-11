import { ExternalLink, Github, FileText, Code } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';
import { ButtonLink } from '@/components/ButtonLink';

export function AboutPage() {
  useSeo(
    {
      title: 'About Cambuz PDF Reader — Rajesh Singh & PixlDot',
      description:
        'Cambuz PDF Reader is developed by Rajesh Singh under the PixlDot brand. It is built around a simple idea: reading a PDF should not require an overloaded application.',
      path: '/about/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `About ${siteConfig.name}`,
      description: `Learn about ${siteConfig.name}, developed by ${siteConfig.creator} under ${siteConfig.brand}.`,
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <SectionHeading
            eyebrow="About"
            title="About Cambuz PDF Reader"
            description="A free desktop PDF reader built around a simple idea: reading a PDF should not require an overloaded application."
            align="left"
          />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creator card */}
          <div className="p-8 rounded-2xl bg-surface/60 border border-border-default card-glow mb-12">
            <div className="flex items-start gap-5">
              <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                <FileText className="w-7 h-7 text-primary" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-text-main">
                  {siteConfig.creator}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Creator of Cambuz PDF Reader
                </p>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  Cambuz PDF Reader is developed by Rajesh Singh under the{' '}
                  <a
                    href={siteConfig.brandWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {siteConfig.brand} brand
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  . It is built around a simple idea: reading a PDF should not
                  require an overloaded application.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-text-main">The idea behind Cambuz</h2>
            <p className="text-text-secondary leading-relaxed mt-4">
              Most PDF readers have grown into large, complex applications with
              editing suites, cloud services, form fillers, and subscription
              tiers. Cambuz takes a different approach. It focuses on the
              everyday task of opening a document and reading it.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              No bloat. No subscriptions. Just PDFs.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              Cambuz is free to use, released under the MIT license, and built as
              a native desktop application. It does what a PDF reader should do —
              display documents, let you search through them, select and copy
              text, and print — without getting in your way.
            </p>
          </div>

          {/* Links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={siteConfig.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl bg-surface/50 border border-border-default hover:border-border-hover transition-all duration-200 group"
            >
              <Github className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors mb-3" />
              <h3 className="text-base font-semibold text-text-main">
                GitHub Repository
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Source code, issues, and releases
              </p>
            </a>
            <a
              href={siteConfig.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl bg-surface/50 border border-border-default hover:border-border-hover transition-all duration-200 group"
            >
              <Code className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors mb-3" />
              <h3 className="text-base font-semibold text-text-main">
                MIT License
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Free and open source
              </p>
            </a>
          </div>

          {/* Brand */}
          <div className="mt-12 p-6 rounded-xl bg-surface/50 border border-border-default">
            <h3 className="text-sm font-semibold text-text-main mb-2">
              {siteConfig.brand}
            </h3>
            <p className="text-sm text-text-secondary">
              Cambuz is a project of PixlDot, founded by Rajesh Singh. Visit{' '}
              <a
                href={siteConfig.brandWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                pixldot.com
                <ExternalLink className="w-3.5 h-3.5" />
              </a>{' '}
              for more information.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <ButtonLink to="/download/" size="md" icon="download">
              Download Cambuz
            </ButtonLink>
            <ButtonLink to="/features/" size="md" variant="secondary">
              View Features
            </ButtonLink>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
