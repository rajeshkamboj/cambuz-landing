import { Check, X } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ButtonLink';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { comparisonRows } from '@/data/features';

export function AlternativesPage() {
  useSeo(
    {
      title: 'Free PDF Reader Alternatives — Cambuz',
      description:
        'Looking for a free alternative to Adobe Reader or Foxit? Cambuz is a free, lightweight desktop PDF reader for Windows with no subscription. Compare features and see if Cambuz is right for you.',
      path: '/free-pdf-reader-alternatives/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free PDF Reader Alternatives — Cambuz',
      description:
        'Compare Cambuz with other free PDF readers. A free, lightweight alternative to Adobe Reader and Foxit.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Free PDF Reader Alternatives' }]} />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            Free PDF reader{' '}
            <span className="text-gradient">alternatives</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Looking for a free alternative to Adobe Acrobat Reader or Foxit
            Reader? Cambuz is a free, lightweight desktop PDF reader for
            Windows. Here is an honest comparison to help you decide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <ButtonLink to="/download/" size="lg" icon="download">
              Download Cambuz
            </ButtonLink>
            <ButtonLink to="/features/" size="lg" variant="secondary">
              See all features
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Comparison"
            title="How Cambuz compares"
            description="An honest comparison of free PDF readers. No claims about competitors' memory use, advertising, privacy, or pricing beyond what is stated below."
            align="left"
          />
          <div className="mt-10 overflow-x-auto">
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
                  <tr key={i} className="border-t border-border-default">
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
            Comparison reflects publicly available information as of 2025.
            Trademarks belong to their respective owners. This comparison is
            provided for informational purposes only.
          </p>
        </div>
      </section>

      {/* Why switch */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why switch"
            title="Reasons to try Cambuz"
            align="left"
          />
          <div className="mt-8 space-y-4">
            {[
              {
                title: 'No subscription, ever',
                desc: 'Cambuz is entirely free under the MIT license. There is no Pro tier, no trial period, and no feature paywall.',
              },
              {
                title: 'Focused on reading',
                desc: 'If you primarily need to open, read, search, and print PDFs, Cambuz gives you exactly that without the overhead of an editing suite.',
              },
              {
                title: 'Portable option',
                desc: 'Run Cambuz from a USB drive with the portable build. No installation required, no registry changes, no leftover files.',
              },
              {
                title: 'Open source',
                desc: 'The source code is available on GitHub. You can inspect it, build it yourself, and contribute if you want to.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-surface/50 border border-border-default"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-semibold text-text-main">
                    {item.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When Cambuz might not be right */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Honesty"
            title="When Cambuz might not be right for you"
            align="left"
          />
          <p className="mt-6 text-text-secondary leading-relaxed">
            Cambuz is a PDF reader, not a PDF editor. If you need any of the
            following, a different tool may be a better fit:
          </p>
          <div className="mt-6 space-y-3">
            {[
              'Editing PDF text or content',
              'Annotation, highlighting, or commenting',
              'Converting PDFs to other formats (Word, Excel, etc.)',
              'Digital signatures and certificate-based signing',
              'XFA and JavaScript-driven forms — those open read-only',
              'Cloud sync, accounts, or collaboration features',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface/20 border border-border-default"
              >
                <X className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-text-secondary leading-relaxed">
            For those tasks, consider a dedicated PDF editor. What Cambuz does
            include is page-level work on a copy — rotate, delete, extract,
            reorder, merge, split and basic metadata — plus filling AcroForm
            fields and saving a filled copy. If you just need to read, search,
            and print PDFs, Cambuz does that — for free, without bloat.
          </p>
        </div>
      </section>

      <CTASection
        title="Try Cambuz as your free PDF reader"
        description="Download for Windows. Free, no subscription, no bloat."
      />
    </>
  );
}
