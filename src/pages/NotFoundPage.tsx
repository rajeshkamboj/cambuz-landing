import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ButtonLink';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useSeo(
    {
      title: 'Page Not Found — Cambuz PDF Reader',
      description: 'The page you are looking for does not exist.',
      path: '/404',
      noindex: true,
    }
  );

  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-7xl sm:text-9xl font-bold text-gradient">404</p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-text-main">
          Page not found
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Try one of the links below to get back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink to="/" size="md" icon="none">
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to homepage
            </span>
          </ButtonLink>
          <ButtonLink to="/features/" size="md" variant="secondary" icon="none">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse features
            </span>
          </ButtonLink>
        </div>
        <div className="mt-8">
          <Link
            to="/download/"
            className="text-sm text-primary hover:text-accent transition-colors"
          >
            Or download Cambuz for Windows →
          </Link>
        </div>
      </div>
    </section>
  );
}
