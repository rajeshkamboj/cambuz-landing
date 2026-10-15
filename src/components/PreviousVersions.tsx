import { ChevronDown, ExternalLink, FileCheck2, History } from 'lucide-react';
import {
  siteConfig,
  previousVersions,
  formatMiB,
  formatReleaseDate,
  type ReleaseVersion,
} from '@/config/site';

/**
 * Older published builds.
 *
 * Every version here is a real, published GitHub release: the links, sizes and
 * checksums come from the generated release record, so this list is rewritten
 * by the sync workflow whenever the app publishes something new. A build
 * removed upstream disappears from this list on the next sync.
 */
export function PreviousVersions() {
  // Nothing to show until the app has more than one published release.
  if (previousVersions.length === 0) return null;

  return (
    <section className="py-12" id="previous-versions">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold text-text-main">
            Previous versions
          </h2>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Older builds, exactly as CI published them — useful when you need to
          roll back or reproduce something on an earlier build.{' '}
          <strong className="text-text-main">They are not maintained:</strong>{' '}
          no fixes, no backports and none of the testing of the current version.
          Prefer the newest build above unless you have a specific reason not
          to.
        </p>
        <p className="mt-3 text-xs text-text-secondary/90 leading-relaxed max-w-3xl">
          Each file is the original release asset, so the checksum published with
          it still applies. The {previousVersions.length} most recent older
          builds are listed; a build that is deleted upstream is removed from
          this list automatically.
        </p>

        <div className="mt-6 space-y-3">
          {previousVersions.map((version) => (
            <VersionRow key={version.tag} version={version} />
          ))}
        </div>

        <p className="mt-6 text-xs text-text-secondary">
          Looking for the newest build?{' '}
          <a
            href="#all-downloads"
            className="text-accent hover:text-primary transition-colors"
          >
            Jump to the current release
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function VersionRow({ version }: { version: ReleaseVersion }) {
  const published = formatReleaseDate(version.publishedAt);
  const shortCommit = version.sourceCommit?.slice(0, 7);

  return (
    <details
      id={`release-${version.tag}`}
      className="group rounded-xl bg-surface/50 border border-border-default hover:border-border-hover open:border-border-hover transition-colors duration-200"
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden p-4 sm:p-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium text-text-main">
              {version.tag}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-surface-2 text-text-secondary border border-border-default capitalize">
              {version.kind}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Superseded
            </span>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            Published <time dateTime={version.publishedAt ?? undefined}>{published}</time>
            {' · '}
            {version.artifacts.length} downloads for Windows, Linux and macOS
            {shortCommit && (
              <>
                {' · '}
                <a
                  href={`${siteConfig.githubRepo}/commit/${version.sourceCommit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-primary transition-colors font-mono"
                >
                  {shortCommit}
                </a>
              </>
            )}
          </p>
        </div>
        <ChevronDown
          className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="px-4 sm:px-5 pb-5">
        <ul className="grid gap-2 sm:grid-cols-2">
          {version.artifacts.map((artifact) => (
            <li
              key={artifact.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-surface-2/50 border border-border-default"
            >
              <div className="min-w-0">
                <p className="text-sm text-text-main">{artifact.label}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {formatMiB(artifact.bytes)} ·{' '}
                  <span className="font-mono break-all">{artifact.fileName}</span>
                </p>
              </div>
              <a
                href={artifact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface text-text-main border border-border-default hover:border-border-hover transition-colors"
              >
                Download
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <a
            href={version.checksums.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            {version.checksums.fileName}
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={version.releasePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            Release page
            <ExternalLink className="w-3 h-3" />
          </a>
          {version.sourceCommit && (
            <a
              href={`${siteConfig.githubRepo}/tree/${version.sourceCommit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              Source at this build
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-medium text-text-secondary hover:text-text-main transition-colors inline-flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
            Show the published SHA-256 for each file
          </summary>
          <div className="mt-3 overflow-x-auto">
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
                {version.artifacts.map((artifact) => (
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
    </details>
  );
}
