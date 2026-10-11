import { Check, Languages, AlertCircle, FileText } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ButtonLink';
import { Screenshot } from '@/components/Screenshot';
import { screenshots } from '@/data/screenshots';
import { SectionHeading } from '@/components/SectionHeading';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';

export function HindiPunjabiPage() {
  useSeo(
    {
      title: 'Read Hindi & Punjabi PDFs on Windows — Cambuz',
      description:
        'Cambuz PDF Reader displays Hindi (Devanagari) and Punjabi (Gurmukhi) PDF documents on Windows. Learn how text extraction depends on PDF font encoding and what to expect.',
      path: '/read-hindi-punjabi-pdf/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Read Hindi and Punjabi PDF documents on Windows with Cambuz PDF Reader.',
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Read Hindi & Punjabi PDFs' }]} />
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Language Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.1]">
            Read Hindi & Punjabi{' '}
            <span className="text-gradient">PDF documents</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Cambuz PDF Reader displays Hindi (Devanagari script) and Punjabi
            (Gurmukhi script) PDF documents on Windows. Here is what to expect
            when reading and extracting text from these documents.
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Display"
            title="Rendering Hindi and Punjabi text"
            align="left"
          />
          <p className="mt-6 text-text-secondary leading-relaxed">
            Cambuz renders PDF documents using the fonts embedded in the file.
            When a Hindi or Punjabi PDF includes properly embedded fonts,
            Cambuz displays the text exactly as the document author intended —
            with correct Devanagari or Gurmukhi script rendering.
          </p>
          <p className="mt-4 text-text-secondary leading-relaxed">
            This means you can open and read Hindi and Punjabi documents just
            like any other PDF: navigate pages, zoom in and out, search for
            text, and print.
          </p>
        </div>
      </section>

      {/* Text extraction caveat */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-yellow-400 mb-2">
                  About text extraction from Hindi and Punjabi PDFs
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  PDFs store text using font encoding maps. Some Hindi and
                  Punjabi PDFs use custom or non-standard font encodings,
                  particularly older documents or those created with certain
                  authoring tools. In these cases, the text you copy may not
                  match what you see on screen.
                </p>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  This is a property of the document itself, not a limitation
                  of the reader. When a PDF uses standard Unicode font
                  encoding, text selection and copying work correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="Reading Hindi and Punjabi PDFs with Cambuz"
            align="left"
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Display Devanagari (Hindi) script correctly',
              'Display Gurmukhi (Punjabi) script correctly',
              'Search for text within the document',
              'Select and copy text (with standard-encoded fonts)',
              'Navigate pages and zoom',
              'Print Hindi and Punjabi documents',
              'Read documents with embedded fonts as authored',
              'No special configuration needed',
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

      {/* Why encoding matters */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Understanding"
            title="Why copied text is sometimes incorrect"
            align="left"
          />
          <div className="mt-8 space-y-4">
            <div className="p-5 rounded-xl bg-surface/50 border border-border-default">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-main mb-1">
                    Standard Unicode encoding
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Modern PDFs that use standard Unicode font encoding allow
                    accurate text extraction. You can search, select, and copy
                    Hindi or Punjabi text and paste it correctly into other
                    applications.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-surface/50 border border-border-default">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-main mb-1">
                    Custom or non-standard encoding
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Some older Hindi and Punjabi PDFs use custom font encodings
                    where each glyph is mapped to a non-standard code point.
                    The text displays correctly on screen, but copying it
                    produces incorrect characters because the mapping does not
                    correspond to standard Unicode values.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-surface/50 border border-border-default">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-main mb-1">
                    Scanned documents (no text layer)
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Scanned PDFs that contain only images have no text layer at
                    all. Cambuz does not include OCR, so text cannot be
                    searched, selected, or copied from these documents. The
                    page images still display and print correctly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Screenshot
              src={screenshots.pages.hindi}
              alt="Cambuz PDF Reader displaying a Hindi-language PDF document in Devanagari script"
              caption="Hindi (Devanagari) sample document in Cambuz"
              frame="app"
              lazy
            />
            <Screenshot
              src={screenshots.pages.punjabi}
              alt="Cambuz PDF Reader displaying a Punjabi-language PDF document in Gurmukhi script"
              caption="Punjabi (Gurmukhi) sample document in Cambuz"
              frame="app"
              lazy
            />
          </div>
        </div>
      </section>

      <CTASection
        title="Read Hindi and Punjabi PDFs on Windows"
        description="Download Cambuz PDF Reader. Free, no subscription, desktop application."
      />
    </>
  );
}
