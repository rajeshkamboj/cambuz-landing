export interface DownloadArtifact {
  platform: string;
  arch: string;
  type: string;
  label: string;
  fileName: string;
  url: string | null;
  size: string | null;
  version: string;
  checksum: string | null;
  status: 'stable' | 'development' | 'experimental';
  experimental: boolean;
  instructions: string;
}

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
  githubRepo: 'https://github.com/pixldotcom/cambuz-pdf',
  // Update this to the production domain before deployment
  productionDomain: 'https://cambuz.pixldot.com',
  version: '1.0.0',
  license: 'MIT',
  licenseUrl: 'https://github.com/pixldotcom/cambuz-pdf/blob/main/LICENSE',
  description:
    'Cambuz is a free desktop PDF reader built for people who want to open, read, search, and print without unnecessary complexity.',
};

export const downloadArtifacts: DownloadArtifact[] = [
  {
    platform: 'Windows',
    arch: 'x64',
    type: 'installer',
    label: 'Windows x64 Installer',
    fileName: 'CambuzPDF-Setup-x64.exe',
    url: null,
    size: null,
    version: siteConfig.version,
    checksum: null,
    status: 'stable',
    experimental: false,
    instructions:
      'Download the installer, double-click to run, and follow the setup wizard. Cambuz will be added to your Start menu and available as a default PDF reader.',
  },
  {
    platform: 'Windows',
    arch: 'x64',
    type: 'portable',
    label: 'Windows x64 Portable',
    fileName: 'CambuzPDF-Portable-x64.exe',
    url: null,
    size: null,
    version: siteConfig.version,
    checksum: null,
    status: 'stable',
    experimental: false,
    instructions:
      'Download the portable executable and run it directly — no installation required. Ideal for USB drives or restricted environments.',
  },
  {
    platform: 'Linux',
    arch: 'x64',
    type: 'AppImage',
    label: 'Linux x64 AppImage',
    fileName: 'CambuzPDF-x86_64.AppImage',
    url: null,
    size: null,
    version: siteConfig.version,
    checksum: null,
    status: 'experimental',
    experimental: true,
    instructions:
      'Download the AppImage, make it executable with chmod +x, and run it. No installation required. This build has not been fully validated across all Linux distributions.',
  },
  {
    platform: 'macOS',
    arch: 'arm64',
    type: 'DMG',
    label: 'macOS arm64 DMG',
    fileName: 'CambuzPDF-arm64.dmg',
    url: null,
    size: null,
    version: siteConfig.version,
    checksum: null,
    status: 'experimental',
    experimental: true,
    instructions:
      'Download the DMG, open it, and drag Cambuz to your Applications folder. This build is for Apple Silicon Macs and has not been fully validated.',
  },
  {
    platform: 'macOS',
    arch: 'arm64',
    type: 'ZIP',
    label: 'macOS arm64 ZIP',
    fileName: 'CambuzPDF-arm64.zip',
    url: null,
    size: null,
    version: siteConfig.version,
    checksum: null,
    status: 'experimental',
    experimental: true,
    instructions:
      'Download the ZIP, extract it, and run the application. This build is for Apple Silicon Macs and has not been fully validated.',
  },
];

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
