import { ButtonLink } from './ButtonLink';
import { Download, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  description?: string;
}

export function CTASection({
  title = 'Ready to read PDFs the simple way?',
  description = 'Download Cambuz PDF Reader for Windows. Free, no subscription, no bloat.',
}: CTASectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-radial-glow"
        aria-hidden="true"
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg text-text-secondary">
          {description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink to="/download/" size="lg" icon="download">
            Download for Windows
          </ButtonLink>
          <ButtonLink to="/features/" size="lg" variant="secondary" icon="arrow">
            Explore Features
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-text-secondary">
          Free to use · No subscription required · Desktop application
        </p>
      </div>
    </section>
  );
}
