import { useState } from 'react';
import {
  Download,
  Check,
  AlertTriangle,
  Monitor,
  Apple,
  Terminal,
  FileText,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { siteConfig, downloadArtifacts, type DownloadArtifact } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Windows: Monitor,
  macOS: Apple,
  Linux: Terminal,
};

export function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState<string>('Windows');

  useSeo(
    {
      title: 'Download Cambuz PDF Reader — Free PDF Reader Download',
      description:
        'Download Cambuz PDF Reader for Windows, Linux, and macOS. Free, no subscription. Installer and portable builds available.',
      path: '/download/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows, Linux, macOS',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      downloadUrl: `${siteConfig.productionDomain}/download/`,
    }
  );

  const platforms = ['Windows', 'Linux', 'macOS'];
  const filteredArtifacts = downloadArtifacts.filter(
    (a) => a.platform === activePlatform
  );

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Download' }]} />
          <SectionHeading
            eyebrow="Download"
            title="Get Cambuz PDF Reader"
            description="Free to download. No subscription, no account required. Choose your platform below."
            align="left"
          />

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-primary" />
              Free to use
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-primary" />
              MIT licensed
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-primary" />
              Version {siteConfig.version}
            </div>
          </div>
        </div>
      </section>

      {/* Platform selector + downloads */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Platform tabs */}
          <div className="flex gap-2 p-1.5 rounded-xl bg-surface/50 border border-border-default w-fit mb-10">
            {platforms.map((platform) => {
              const Icon = platformIcons[platform] || Monitor;
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePlatform === platform
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-text-secondary hover:text-text-main hover:bg-surface'
                  }`}
                  aria-pressed={activePlatform === platform}
                >
                  <Icon className="w-4 h-4" />
                  {platform}
                </button>
              );
            })}
          </div>

          {/* Download cards */}
          <div className="grid gap-4">
            {filteredArtifacts.map((artifact) => (
              <DownloadCard key={artifact.label} artifact={artifact} />
            ))}
          </div>

          {/* Installation guidance */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InstallationGuide platform={activePlatform} />
            <SecurityNote />
          </div>

          {/* All platforms note */}
          <div className="mt-12 p-6 rounded-xl bg-surface/50 border border-border-default">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-text-main mb-2">
                  Platform support status
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Windows is the primary launch platform with stable installer
                  and portable builds. Linux (AppImage) and macOS (Apple Silicon)
                  builds are available as experimental builds that have not been
                  fully validated across all distributions and hardware
                  configurations. Additional platform support will be rolled out
                  as builds are properly tested.
                </p>
                <p className="mt-3 text-sm text-text-secondary">
                  Download links will point to GitHub Release assets once
                  published. Until then, artifacts may be available as CI builds
                  with access or expiration limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure if Cambuz is right for you?"
        description="Explore the features and see how Cambuz keeps PDF reading simple."
      />
    </>
  );
}

function DownloadCard({ artifact }: { artifact: DownloadArtifact }) {
  return (
    <div className="p-6 rounded-xl bg-surface/60 border border-border-default hover:border-border-hover transition-all duration-200 card-glow-hover">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-text-main">
              {artifact.label}
            </h3>
            {artifact.experimental && (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                Experimental
              </span>
            )}
            {!artifact.experimental && (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Stable
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary">
            <span>Type: {artifact.type}</span>
            <span>Version: {artifact.version}</span>
            <span>Architecture: {artifact.arch}</span>
            {artifact.size && <span>Size: {artifact.size}</span>}
          </div>
        </div>

        <div className="flex-shrink-0">
          {artifact.url ? (
            <a
              href={artifact.url}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 border border-border-default text-text-secondary font-medium text-sm cursor-not-allowed">
                <Download className="w-4 h-4" />
                Coming soon
              </span>
              <span className="text-xs text-text-secondary">
                Awaiting GitHub Release
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-border-default">
        <p className="text-sm text-text-secondary leading-relaxed">
          {artifact.instructions}
        </p>
      </div>

      {/* Checksum */}
      {artifact.checksum && (
        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>SHA-256: </span>
          <code className="font-mono text-text-secondary/80">
            {artifact.checksum}
          </code>
        </div>
      )}
    </div>
  );
}

function InstallationGuide({ platform }: { platform: string }) {
  const guides: Record<string, { title: string; steps: string[] }> = {
    Windows: {
      title: 'Windows installation',
      steps: [
        'Download the installer (.exe) or portable build.',
        'For the installer: double-click and follow the setup wizard.',
        'For the portable build: run the executable directly — no installation needed.',
        'Cambuz will be available in your Start menu (installer) or from the downloaded location (portable).',
      ],
    },
    Linux: {
      title: 'Linux installation',
      steps: [
        'Download the AppImage file.',
        'Make it executable: chmod +x CambuzPDF-*.AppImage',
        'Run the AppImage by double-clicking or from terminal.',
        'No installation required. This build is experimental.',
      ],
    },
    macOS: {
      title: 'macOS installation',
      steps: [
        'Download the DMG or ZIP for Apple Silicon Macs.',
        'For DMG: open it and drag Cambuz to Applications.',
        'For ZIP: extract and run the application.',
        'These builds are experimental and for Apple Silicon only.',
      ],
    },
  };

  const guide = guides[platform] || guides.Windows;

  return (
    <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-text-main">{guide.title}</h3>
      </div>
      <ol className="space-y-3">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-text-secondary leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SecurityNote() {
  return (
    <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <h3 className="text-base font-semibold text-text-main">
          About unsigned builds
        </h3>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">
        Cambuz builds are currently unsigned. This means Windows SmartScreen may
        display a warning when you run the installer. This is expected for
        software without a code signing certificate.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        If you see a SmartScreen warning, click <strong className="text-text-main">More info</strong>{' '}
        and then <strong className="text-text-main">Run anyway</strong> to
        proceed. You should only do this for software you trust.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Never disable Windows security protections to install any software.
        Code signing may be added in a future release to resolve this.
      </p>
    </div>
  );
}
