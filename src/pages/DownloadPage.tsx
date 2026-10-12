import { useState } from 'react';
import {
  AlertTriangle,
  Apple,
  Check,
  ExternalLink,
  FileCheck2,
  FileText,
  Info,
  Monitor,
  Terminal,
} from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import {
  siteConfig,
  downloadArtifacts,
  unsupportedPlatforms,
  formatMiB,
  type DownloadArtifact,
  type Platform,
} from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';
import { ButtonLink } from '@/components/ButtonLink';

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  Windows: Monitor,
  macOS: Apple,
  Linux: Terminal,
};

const platforms: Platform[] = ['Windows', 'macOS', 'Linux'];

const recommended = downloadArtifacts.find((artifact) => artifact.recommended)!;

export function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>('Windows');

  useSeo(
    {
      title: 'Download Cambuz PDF Reader — Free PDF Reader Download',
      description: `Download Cambuz PDF Reader ${siteConfig.version} for Windows 10/11 x64 — installer or portable. Linux and macOS builds are available as experimental previews. Free, no subscription.`,
      path: '/download/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows 10, Windows 11, Linux, macOS 13+',
      softwareVersion: siteConfig.version,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      downloadUrl: recommended.url,
      sameAs: siteConfig.releasePageUrl,
      license: siteConfig.licenseUrl,
    }
  );

  const filteredArtifacts = downloadArtifacts.filter(
    (artifact) => artifact.platform === activePlatform
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
            description="Free to download. No subscription, no account. The files below are the permanent release assets from the app's GitHub release, not expiring CI builds."
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
              Version {siteConfig.version} pre-release
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-primary" />
              Works offline, no telemetry
            </div>
          </div>
        </div>
      </section>

      {/* Recommended download */}
      <section className="pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface/70 border border-primary/30 card-glow">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/25">
                Recommended
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Primary target · CI-verified
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-text-main">
                  {recommended.label}
                </h2>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {recommended.summary}
                </p>
                <p className="mt-3 text-xs text-text-secondary">
                  {recommended.fileName} · {formatMiB(recommended.bytes)} · Windows
                  10/11 x64
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
                <ButtonLink
                  to={recommended.url}
                  external
                  size="lg"
                  icon="download"
                  className="w-full justify-center"
                >
                  Download for Windows
                </ButtonLink>
                <a
                  href="#all-downloads"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-text-main transition-colors px-2 py-1"
                >
                  Other platforms &amp; portable
                </a>
              </div>
            </div>
            <p className="mt-6 pt-4 border-t border-border-default text-xs text-text-secondary leading-relaxed">
              Unsigned build: Windows SmartScreen will warn you on first run.
              That is expected — choose <strong className="text-text-main">More info</strong> →{' '}
              <strong className="text-text-main">Run anyway</strong> after checking the{' '}
              <a
                href="#verify"
                className="text-accent hover:text-primary transition-colors"
              >
                SHA-256 checksum
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Pre-release honesty note */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-text-main mb-2">
                  What &ldquo;{siteConfig.releaseTag}&rdquo; means
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {siteConfig.automaticBuild ? (
                    <>
                      This is an <strong className="text-text-main">automatic pre-release build</strong>{' '}
                      published after a successful merge to the app&apos;s main branch. It is
                      pinned to this exact release and checksum; download it for evaluation
                      and report problems before relying on it in production.{' '}
                    </>
                  ) : (
                    <>
                      {siteConfig.version} is published as a{' '}
                      <strong className="text-text-main">release candidate</strong>. Automated
                      acceptance tests passed on CI runners, but a person has not yet run the
                      manual acceptance pass on real hardware — that pass is what gates a full
                      release. When it passes, these same files are promoted, so the checksums
                      you verify below will not change.{' '}
                    </>
                  )}
                  <a
                    href={siteConfig.releasePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Release page
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {' · '}
                  <a
                    href={siteConfig.releaseNotesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Release notes
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform selector + downloads */}
      <section className="py-8" id="all-downloads">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scrolls rather than overflowing the page on narrow screens */}
          <div className="mb-10 overflow-x-auto">
            <div
              className="flex gap-2 p-1.5 rounded-xl bg-surface/50 border border-border-default w-fit"
              role="tablist"
              aria-label="Choose a platform"
            >
              {platforms.map((platform) => {
                const Icon = platformIcons[platform];
                const isExperimental =
                  downloadArtifacts.find((a) => a.platform === platform)?.support ===
                  'experimental';
                return (
                  <button
                    key={platform}
                    onClick={() => setActivePlatform(platform)}
                    role="tab"
                    aria-selected={activePlatform === platform}
                    className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-2.5 sm:px-5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePlatform === platform
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-text-secondary hover:text-text-main hover:bg-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {platform}
                    {isExperimental && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                        title="Experimental build"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredArtifacts.map((artifact) => (
              <DownloadCard key={artifact.id} artifact={artifact} />
            ))}
          </div>

          {/* Installation guidance */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InstallationGuide platform={activePlatform} />
            <SecurityNote />
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="py-12" id="verify">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck2 className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-text-main">
                Verify your download
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Because the builds are unsigned, the checksum is how you confirm a
              file is the one CI produced. Download the files, then run{' '}
              <code className="font-mono text-xs text-text-main">
                Get-FileHash -Algorithm SHA256 &lt;file&gt;
              </code>{' '}
              (PowerShell) or{' '}
              <code className="font-mono text-xs text-text-main">
                sha256sum -c SHA256SUMS.txt
              </code>{' '}
              (Linux/macOS, next to the downloaded files).
            </p>
            <p className="mt-3 text-sm text-text-secondary">
              <a
                href={siteConfig.checksumsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                Download {siteConfig.checksumsFileName}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>{' '}
              — published on the {siteConfig.releaseTag} release.
            </p>

            <details className="mt-5 group">
              <summary className="cursor-pointer text-sm font-medium text-text-main hover:text-primary transition-colors">
                Show the published SHA-256 for each file
              </summary>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 pr-4 text-xs font-semibold text-text-secondary">
                        File
                      </th>
                      <th className="py-2 text-xs font-semibold text-text-secondary">
                        SHA-256
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadArtifacts.map((artifact) => (
                      <tr key={artifact.id} className="border-t border-border-default">
                        <td className="py-2 pr-4 text-xs text-text-secondary align-top">
                          {artifact.fileName}
                        </td>
                        <td className="py-2 text-xs font-mono text-text-secondary/90 break-all">
                          {artifact.sha256}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Platform support status */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-surface/50 border border-border-default">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="w-full">
                <h3 className="text-base font-semibold text-text-main mb-2">
                  Platform support status
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Windows 10/11 x64 is the primary target: it is built and
                  exercised by automated packaged-app tests in CI. Linux x86_64
                  and macOS 13+ (Apple Silicon) builds exist as{' '}
                  <strong className="text-text-main">experimental previews</strong>{' '}
                  — they compile and pass headless CI checks, but nobody has
                  launched them on a real desktop yet.
                </p>
                <ul className="mt-4 space-y-2">
                  {unsupportedPlatforms.map((item) => (
                    <li
                      key={item.platform}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-text-secondary/50 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        <strong className="text-text-main">{item.platform}</strong>{' '}
                        — {item.reason}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                  Windows 10 or newer, macOS 13 or newer and a modern x64 Linux
                  are required: the app ships on the Electron 44 runtime, which
                  dropped Windows 7/8, 32-bit systems and macOS 12. There are no
                  automatic updates — come back and download a new build when one
                  is published.
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

function SupportBadge({ support }: { support: DownloadArtifact['support'] }) {
  if (support === 'primary') {
    return (
      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
        Primary · CI-verified
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
      Experimental
    </span>
  );
}

function DownloadCard({ artifact }: { artifact: DownloadArtifact }) {
  return (
    <div className="p-6 rounded-xl bg-surface/60 border border-border-default hover:border-border-hover transition-all duration-200 card-glow-hover">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-text-main">
              {artifact.label}
            </h3>
            <SupportBadge support={artifact.support} />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {artifact.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-secondary">
            <span>Version {artifact.version}</span>
            <span>Architecture: {artifact.arch}</span>
            <span>{formatMiB(artifact.bytes)}</span>
            <span className="font-mono">{artifact.fileName}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ButtonLink
            to={artifact.url}
            external
            icon="download"
            className="w-full sm:w-auto justify-center"
          >
            Download {formatMiB(artifact.bytes)}
          </ButtonLink>
        </div>
      </div>

      <p className="mt-4 pt-4 border-t border-border-default text-xs text-text-secondary leading-relaxed">
        {artifact.status}
      </p>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-text-secondary hover:text-text-main transition-colors">
          How to install
        </summary>
        <ol className="mt-3 space-y-3">
          {artifact.instructions.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-text-secondary leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

const installGuides: Record<Platform, { title: string; steps: string[] }> = {
  Windows: {
    title: 'Windows in four steps',
    steps: [
      'Download the installer (or the portable .exe to skip installing).',
      'Double-click it, then choose More info → Run anyway at the SmartScreen prompt.',
      'Follow the setup wizard — the install is per-user, so no admin rights are needed.',
      'Open a PDF from your file manager, or launch Cambuz and use Open.',
    ],
  },
  macOS: {
    title: 'macOS in four steps',
    steps: [
      'Download the DMG and open it, or unzip the ZIP.',
      'Drag Cambuz into Applications.',
      'Right-click the app and choose Open, or allow it in System Settings → Privacy & Security (Gatekeeper blocks unsigned apps by default).',
      'This build has never been launched by anyone — report what happens in GitHub issues.',
    ],
  },
  Linux: {
    title: 'Linux in four steps',
    steps: [
      'Download the AppImage.',
      `Make it executable: chmod +x ${downloadArtifacts.find((artifact) => artifact.id === 'linux-x86_64-appimage')!.fileName}`,
      'Run it from your file manager or a terminal.',
      'No installation and no package manager are involved. The build passed headless CI checks only.',
    ],
  },
};

function InstallationGuide({ platform }: { platform: Platform }) {
  const guide = installGuides[platform];

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
        There is no code-signing certificate yet, so Windows SmartScreen will
        warn you the first time you run Cambuz, and macOS Gatekeeper will refuse
        the first launch. This is expected for unsigned software, not a sign that
        something is wrong with your download.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Check the SHA-256 against {siteConfig.checksumsFileName} first, then
        allow the app to run. Never disable Windows security protections or
        Gatekeeper to install any software.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        The source and the build pipeline are public, so both the code and the
        artifacts are open to inspection:{' '}
        <a
          href={siteConfig.githubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-primary transition-colors"
        >
          {siteConfig.githubRepo.replace('https://', '')}
        </a>
        .
      </p>
    </div>
  );
}
