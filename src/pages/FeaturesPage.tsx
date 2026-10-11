import {
  BookOpen,
  Search,
  MousePointer2,
  Printer,
  Languages,
  Monitor,
  Check,
} from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { Screenshot } from '@/components/Screenshot';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { features } from '@/data/features';
import { featureScreenshot } from '@/data/screenshots';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Search,
  MousePointer2,
  Printer,
  Languages,
  Monitor,
};

export function FeaturesPage() {
  useSeo(
    {
      title: 'PDF Reader Features — Cambuz',
      description:
        'Explore Cambuz PDF Reader features: clean reading interface, full-text search, text selection and copying, printing, Hindi and Punjabi support, and offline desktop use.',
      path: '/features/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Cambuz PDF Reader',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows',
      featureList: features.map((f) => f.headline),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Features' }]} />
          <SectionHeading
            eyebrow="Features"
            title="Built for reading, not for bloat"
            description="Every feature in Cambuz exists to help you read, search, and print PDFs. Nothing more, nothing less."
            align="left"
          />
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || BookOpen;
              const reversed = i % 2 === 1;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
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

      <CTASection />
    </>
  );
}
