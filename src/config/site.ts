import { release, releaseHistory } from './release.generated';

/**
 * Site + product configuration.
 *
 * Download metadata is generated in release.generated.ts after each successful
 * cambuz-pdf main build. Every public URL remains pinned to the exact release
 * tag; this site deliberately never uses GitHub's /releases/latest endpoint.
 *
 * `downloadArtifacts` below is always the newest published build and is what
 * the home page and the top of the download page link to. `previousVersions`
 * is the same catalog resolved against older published builds, so an older
 * version can be offered without a second copy of this file drifting.
 */

const REPO = 'https://github.com/rajeshkamboj/cambuz-pdf';

/** Release tag that serves every download on this site. Pre-release, by design. */
const RELEASE_TAG = release.tag;

/** Product version the tag above contains. */
const RELEASE_VERSION = release.version;

export const siteConfig = {
  name: 'Cambuz PDF Reader',
  shortName: 'Cambuz',
  tagline: 'Your PDFs. Nothing in the way.',
  positioning: 'A free PDF reader without the bloat.',
  supportingMessage:
    'Open a PDF. Read it. Search it. Print it. Get back to work.',
  brand: 'PixlDot',
  creator: 'Rajesh Singh',
  brandWebsite: 'https://pixldot.com/',
  githubRepo: REPO,
  issuesUrl: `${REPO}/issues`,
  licenseUrl: `${REPO}/blob/main/LICENSE`,
  thirdPartyNoticesUrl: `${REPO}/blob/main/THIRD-PARTY-NOTICES.md`,
  releaseNotesUrl: release.releaseNotesUrl,
  buildWorkflowUrl: `${REPO}/actions/workflows/desktop-build.yml`,
  // Public origin of this site. Also used for canonicals, the sitemap and the
  // absolute og:image URL — change it in one place, here.
  productionDomain: 'https://cambuz.pixldot.com',
  version: RELEASE_VERSION,
  releaseTag: RELEASE_TAG,
  automaticBuild: release.automaticBuild,
  releasePageUrl: release.releasePageUrl,
  /** ISO timestamp of the newest published build, from GitHub. */
  releasePublishedAt: release.publishedAt,
  /** How many older published builds the download page lists. */
  previousVersionCount: releaseHistory.length,
  checksumsFileName: 'SHA256SUMS.txt',
  checksumsUrl: release.artifacts.checksums.url,
  license: 'MIT',
  description:
    'Cambuz is a free desktop PDF reader built for people who want to open, read, search, and print without unnecessary complexity.',
} as const;

export type Platform = 'Windows' | 'macOS' | 'Linux';

/** 'primary' = the CI-verified target. 'experimental' = built and CI-checked only. */
export type SupportLevel = 'primary' | 'experimental';

/** One generated asset record, exactly as the GitHub Releases API reported it. */
export interface ReleaseAsset {
  fileName: string;
  url: string;
  bytes: number;
  sha256: string;
}

/** Every asset set published for one release, keyed by artifact. */
export interface ReleaseArtifactSet {
  winX64Setup: ReleaseAsset;
  winX64Portable: ReleaseAsset;
  linuxX8664AppImage: ReleaseAsset;
  macArm64Dmg: ReleaseAsset;
  macArm64Zip: ReleaseAsset;
  checksums: ReleaseAsset;
}

/** The five advertised installers — everything except the checksum list. */
export type AdvertisedArtifactKey = Exclude<keyof ReleaseArtifactSet, 'checksums'>;

export interface DownloadArtifact {
  id: string;
  platform: Platform;
  arch: string;
  /** Shown as the card title. */
  label: string;
  /** What the file is, in one honest line. */
  summary: string;
  fileName: string;
  url: string;
  /** Exact size of the published asset, in bytes. */
  bytes: number;
  /** SHA-256 published in SHA256SUMS.txt for this asset. */
  sha256: string;
  version: string;
  support: SupportLevel;
  /** One-line honest statement of how far this build has been validated. */
  status: string;
  /** Ordered, plain steps — no promises about what has not been tested. */
  instructions: string[];
  /** The single recommended download for most people. */
  recommended: boolean;
}

/**
 * What each advertised download *is*. This is hand-written, reviewed copy that
 * does not change between releases; the size, URL, version and checksum inside
 * `DownloadArtifact` always come from the generated release record.
 */
interface ArtifactPresentation {
  id: string;
  key: AdvertisedArtifactKey;
  platform: Platform;
  arch: string;
  label: string;
  summary: string;
  support: SupportLevel;
  status: string;
  /** `{fileName}` is replaced with the exact published file name. */
  instructions: string[];
  recommended: boolean;
}

const artifactCatalog: readonly ArtifactPresentation[] = [
  {
    id: 'win-x64-setup',
    key: 'winX64Setup',
    platform: 'Windows',
    arch: 'x64',
    label: 'Windows x64 — Installer',
    summary:
      'NSIS installer for Windows 10 and 11. Per-user install, no admin rights, Start menu entry and an optional .pdf association you stay in control of.',
    support: 'primary',
    status:
      'Primary target. Built and verified by automated packaged-app tests in CI; a person has not yet run the manual acceptance pass on Windows hardware.',
    instructions: [
      'Download the installer, then double-click it.',
      'Windows SmartScreen will warn you because the build is unsigned: choose More info, then Run anyway.',
      'Cambuz is added to your Start menu. Accept the optional .pdf association only if you want Cambuz as your default reader.',
      'Uninstalling removes the app, the Start menu entry and the association cleanly.',
    ],
    recommended: true,
  },
  {
    id: 'win-x64-portable',
    key: 'winX64Portable',
    platform: 'Windows',
    arch: 'x64',
    label: 'Windows x64 — Portable',
    summary:
      'The same app as a single .exe that extracts itself at launch. Run it from Downloads, a USB stick or any folder — nothing is installed.',
    support: 'primary',
    status:
      'Primary target, same CI-verified packaged tests as the installer; no manual acceptance pass on Windows hardware yet.',
    instructions: [
      'Download the portable .exe and run it — there is no setup step.',
      'It extracts itself on launch, so the first start takes a moment longer.',
      'Keep it on a USB stick or in a folder you control; nothing is written to Program Files and no Start menu entry is created.',
      'Expect the same SmartScreen warning as the installer, for the same reason: the build is unsigned.',
    ],
    recommended: false,
  },
  {
    id: 'linux-x86_64-appimage',
    key: 'linuxX8664AppImage',
    platform: 'Linux',
    arch: 'x86_64',
    label: 'Linux x86_64 — AppImage',
    summary:
      'Single-file AppImage for modern x64 Linux distributions. No installation, no package manager.',
    support: 'experimental',
    status:
      'Experimental: built and passed 32/32 packaged checks in headless CI. It has never been launched on a real Linux desktop, so treat it as a preview.',
    instructions: [
      'Download the AppImage and make it executable: chmod +x {fileName}',
      'Run it from your file manager or a terminal.',
      'If it does not start, your distribution is probably missing a FUSE or GTK library — the AppImage needs the same desktop libraries as other Electron apps.',
      'Please report what you hit: this build has never been run by a person.',
    ],
    recommended: false,
  },
  {
    id: 'mac-arm64-dmg',
    key: 'macArm64Dmg',
    platform: 'macOS',
    arch: 'arm64 (Apple Silicon)',
    label: 'macOS Apple Silicon — DMG',
    summary:
      'Drag-to-Applications disk image for macOS 13 or newer on Apple Silicon. Unsigned and not notarized.',
    support: 'experimental',
    status:
      'Experimental: the app bundle was built and its contents checked in CI, but it has never been launched — not on CI, not on a Mac. There is no Intel build.',
    instructions: [
      'Download the DMG, open it and drag Cambuz into Applications.',
      'Gatekeeper will refuse the first launch because the build is unsigned and not notarized. Open System Settings → Privacy & Security and choose Open Anyway, or right-click the app and choose Open.',
      'Do not disable Gatekeeper or any macOS security feature to run it.',
      'Expect rough edges: nobody has run this build yet.',
    ],
    recommended: false,
  },
  {
    id: 'mac-arm64-zip',
    key: 'macArm64Zip',
    platform: 'macOS',
    arch: 'arm64 (Apple Silicon)',
    label: 'macOS Apple Silicon — ZIP',
    summary:
      'The same Apple Silicon app bundle as a plain ZIP, for people who prefer to unpack it themselves.',
    support: 'experimental',
    status:
      'Experimental: identical bundle to the DMG, never launched. Unsigned and not notarized.',
    instructions: [
      'Download the ZIP and extract it.',
      'Move Cambuz.app wherever you keep applications.',
      'The first launch is blocked by Gatekeeper for the same reason as the DMG: no Apple notarization yet.',
      'This is the least-tested download on this page.',
    ],
    recommended: false,
  },
];

/** Resolves the reviewed catalog above against one published release. */
function artifactsFor(
  assets: ReleaseArtifactSet,
  version: string
): DownloadArtifact[] {
  return artifactCatalog.map((entry) => {
    const asset = assets[entry.key];
    return {
      id: entry.id,
      platform: entry.platform,
      arch: entry.arch,
      label: entry.label,
      summary: entry.summary,
      fileName: asset.fileName,
      url: asset.url,
      bytes: asset.bytes,
      sha256: asset.sha256,
      version,
      support: entry.support,
      status: entry.status,
      instructions: entry.instructions.map((step) =>
        step.split('{fileName}').join(asset.fileName)
      ),
      recommended: entry.recommended,
    };
  });
}

/** The five advertised installers of the newest published build. */
export const downloadArtifacts: DownloadArtifact[] = artifactsFor(
  release.artifacts,
  RELEASE_VERSION
);

export type ReleaseKind = 'automatic build' | 'release candidate' | 'release';

export interface ReleaseVersion {
  tag: string;
  version: string;
  prerelease: boolean;
  automaticBuild: boolean;
  /** ISO timestamp from GitHub; null when a release has no publish date. */
  publishedAt: string | null;
  /** Released commit, or null when the tag was pushed by hand. */
  sourceCommit: string | null;
  releasePageUrl: string;
  /** Plain description of what kind of build this is. */
  kind: ReleaseKind;
  /** Every advertised download for this exact release, with its checksum. */
  artifacts: DownloadArtifact[];
  checksums: ReleaseAsset;
  isLatest: boolean;
}

function releaseKind(entry: {
  automaticBuild: boolean;
  prerelease: boolean;
}): ReleaseKind {
  if (entry.automaticBuild) return 'automatic build';
  return entry.prerelease ? 'release candidate' : 'release';
}

function toReleaseVersion(
  entry: {
    tag: string;
    version: string;
    prerelease: boolean;
    automaticBuild: boolean;
    publishedAt: string | null;
    sourceCommit: string | null;
    releasePageUrl: string;
    artifacts: ReleaseArtifactSet;
  },
  isLatest: boolean
): ReleaseVersion {
  return {
    tag: entry.tag,
    version: entry.version,
    prerelease: entry.prerelease,
    automaticBuild: entry.automaticBuild,
    publishedAt: entry.publishedAt,
    sourceCommit: entry.sourceCommit,
    releasePageUrl: entry.releasePageUrl,
    kind: releaseKind(entry),
    artifacts: artifactsFor(entry.artifacts, entry.version),
    checksums: entry.artifacts.checksums,
    isLatest,
  };
}

/** The newest published build, as a version record like the ones below. */
export const latestRelease: ReleaseVersion = toReleaseVersion(release, true);

/**
 * Older published builds, newest first, straight from the generated record.
 *
 * These exist for rollback and troubleshooting. They are never the default
 * download: the newest build is always the one the site leads with, and the
 * download page says plainly that older builds are not maintained.
 */
export const previousVersions: ReleaseVersion[] = releaseHistory.map((entry) =>
  toReleaseVersion(entry, false)
);

/** Newest first. Always at least the latest build. */
export const releaseVersions: ReleaseVersion[] = [
  latestRelease,
  ...previousVersions,
];

/**
 * Formats a release timestamp as a stable, unambiguous date. Locale and time
 * zone are pinned so the build output never depends on the machine it ran on.
 */
export function formatReleaseDate(iso: string | null): string {
  if (!iso) return 'date not published';
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return 'date not published';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(time);
}

/** Platform/architecture combinations that are deliberately not built. */
export const unsupportedPlatforms = [
  { platform: 'Windows arm64', reason: 'Not built.' },
  { platform: 'Intel Mac (x64)', reason: 'Not built — Apple Silicon only.' },
  { platform: 'Linux arm64', reason: 'Not built.' },
];

/** Formats an exact byte count the way the app's own README does. */
export function formatMiB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

export const routes = [
  { path: '/', label: 'Home', nav: false },
  { path: '/features/', label: 'Features', nav: true },
  { path: '/about/', label: 'About', nav: true },
  { path: '/download/', label: 'Downloads', nav: true },
  { path: '/free-pdf-reader-windows/', label: 'Windows', nav: false },
  { path: '/lightweight-pdf-reader/', label: 'Lightweight', nav: false },
  { path: '/offline-pdf-reader/', label: 'Offline', nav: false },
  { path: '/read-hindi-punjabi-pdf/', label: 'Hindi/Punjabi', nav: false },
  { path: '/print-pdf-windows/', label: 'Print', nav: false },
  { path: '/free-pdf-reader-alternatives/', label: 'Alternatives', nav: false },
];
