import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { ButtonLink } from './ButtonLink';

const navLinks = [
  { to: '/features/', label: 'Features' },
  { to: '/about/', label: 'Why Cambuz' },
  { to: '/download/', label: 'Downloads' },
  { to: '/about/', label: 'About' },
  { to: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-border-default'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link, i) => {
                const isActive =
                  link.to === location.pathname ||
                  (link.to !== '/' && location.pathname.startsWith(link.to) && !link.to.includes('#'));
                // Avoid duplicate active states
                const uniqueLink = link.to !== '/about/' || i !== 1;
                if (link.to === '/about/' && i === 1) return null;
                return (
                  <Link
                    key={`${link.to}-${i}`}
                    to={link.to}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'text-text-main'
                        : 'text-text-secondary hover:text-text-main'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <ButtonLink to="/download/" size="sm" icon="download">
                Download
              </ButtonLink>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-main hover:bg-surface/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-16 bg-bg/95 backdrop-blur-md animate-fade-in">
          <nav
            className="flex flex-col p-6 gap-2"
            aria-label="Mobile navigation"
          >
            {navLinks.filter((_, i) => i !== 1).map((link, i) => (
              <Link
                key={`${link.to}-${i}`}
                to={link.to}
                className="px-4 py-3 text-base font-medium text-text-secondary hover:text-text-main hover:bg-surface rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              <ButtonLink to="/download/" size="md" icon="download" className="w-full">
                Download for Windows
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
