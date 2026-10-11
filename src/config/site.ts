import { release } from './release.generated';

/**
 * Site + product configuration.
 *
 * Download metadata is generated in release.generated.ts after each successful
 * cambuz-pdf main build. Every public URL remains pinned to the exact release
 * tag; this site deliberately never uses GitHub's /releases/latest endpoint.
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
  releasePageUrl: `${REPO}/releases/tag/${RELEASE_TAG}`,
  checksumsFileName: 'SHA256SUMS.txt',
  checksumsUrl: release.artifacts.checksums.url,
  license: 'MIT',
  description:
    'Cambuz is a free desktop PDF reader built for people who want to open, read, search, and print without unnecessary complexity.',
} as const;

export type Platform = 'Windows' | 'macOS' | 'Linux';

/** 'primary' = the CI-verified target. 'experimental' = built and CI-checked only. */
export type SupportLevel = 'primary' | 'experimental';

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

export const downloadArtifacts: DownloadArtifact[] = [
  {
    id: 'win-x64-setup',
    platform: 'Windows',
    arch: 'x64',
    label: 'Windows x64 — Installer',
    summary:
      'NSIS installer for Windows 10 and 11. Per-user install, no admin rights, Start menu entry and an optional .pdf association you stay in control of.',
    fileName: release.artifacts.winX64Setup.fileName,
    url: release.artifacts.winX64Setup.url,
    bytes: release.artifacts.winX64Setup.bytes,
    sha256: release.artifacts.winX64Setup.sha256,
    version: RELEASE_VERSION,
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
    platform: 'Windows',
    arch: 'x64',
    label: 'Windows x64 — Portable',
    summary:
      'The same app as a single .exe that extracts itself at launch. Run it from Downloads, a USB stick or any folder — nothing is installed.',
    fileName: release.artifacts.winX64Portable.fileName,
    url: release.artifacts.winX64Portable.url,
    bytes: release.artifacts.winX64Portable.bytes,
    sha256: release.artifacts.winX64Portable.sha256,
    version: RELEASE_VERSION,
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
    platform: 'Linux',
    arch: 'x86_64',
    label: 'Linux x86_64 — AppImage',
    summary:
      'Single-file AppImage for modern x64 Linux distributions. No installation, no package manager.',
    fileName: release.artifacts.linuxX8664AppImage.fileName,
    url: release.artifacts.linuxX8664AppImage.url,
    bytes: release.artifacts.linuxX8664AppImage.bytes,
    sha256: release.artifacts.linuxX8664AppImage.sha256,
    version: RELEASE_VERSION,
    support: 'experimental',
    status:
      'Experimental: built and passed 32/32 packaged checks in headless CI. It has never been launched on a real Linux desktop, so treat it as a preview.',
    instructions: [
      `Download the AppImage and make it executable: chmod +x ${release.artifacts.linuxX8664AppImage.fileName}`,
      'Run it from your file manager or a terminal.',
      'If it does not start, your distribution is probably missing a FUSE or GTK library — the AppImage needs the same desktop libraries as other Electron apps.',
      'Please report what you hit: this build has never been run by a person.',
    ],
    recommended: false,
  },
  {
    id: 'mac-arm64-dmg',
    platform: 'macOS',
    arch: 'arm64 (Apple Silicon)',
    label: 'macOS Apple Silicon — DMG',
    summary:
      'Drag-to-Applications disk image for macOS 13 or newer on Apple Silicon. Unsigned and not notarized.',
    fileName: release.artifacts.macArm64Dmg.fileName,
    url: release.artifacts.macArm64Dmg.url,
    bytes: release.artifacts.macArm64Dmg.bytes,
    sha256: release.artifacts.macArm64Dmg.sha256,
    version: RELEASE_VERSION,
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
    platform: 'macOS',
    arch: 'arm64 (Apple Silicon)',
    label: 'macOS Apple Silicon — ZIP',
    summary:
      'The same Apple Silicon app bundle as a plain ZIP, for people who prefer to unpack it themselves.',
    fileName: release.artifacts.macArm64Zip.fileName,
    url: release.artifacts.macArm64Zip.url,
    bytes: release.artifacts.macArm64Zip.bytes,
    sha256: release.artifacts.macArm64Zip.sha256,
    version: RELEASE_VERSION,
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
