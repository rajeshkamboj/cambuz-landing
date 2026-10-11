import { generatedFeatures } from './features.generated';

export interface Feature {
  id: string;
  headline: string;
  description: string;
  bullets: string[];
  screenshotAlt: string;
  screenshotCaption: string;
  icon: string;
  /** Optional local screenshot slot. Missing slots intentionally render a placeholder. */
  screenshotId?: string;
}

/**
 * Product copy is owned by cambuz-pdf/docs/landing-content.json and copied here
 * by the release-sync workflow. Keeping it generated prevents the app README,
 * downloadable build and marketing site from drifting after a release.
 */
export const features: readonly Feature[] = generatedFeatures;

export interface ComparisonRow {
  feature: string;
  cambuz: string;
  adobeReader: string;
  foxit: string;
  sumatra: string;
}

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Free to use',
    cambuz: 'Yes, MIT license',
    adobeReader: 'Free with paid Pro tier',
    foxit: 'Free with paid Pro tier',
    sumatra: 'Yes, open source',
  },
  {
    feature: 'Subscription required',
    cambuz: 'No',
    adobeReader: 'No (Pro features require subscription)',
    foxit: 'No (Pro features require subscription)',
    sumatra: 'No',
  },
  {
    feature: 'Desktop application',
    cambuz: 'Yes',
    adobeReader: 'Yes',
    foxit: 'Yes',
    sumatra: 'Yes',
  },
  {
    feature: 'Core reading and search',
    cambuz: 'Yes',
    adobeReader: 'Yes',
    foxit: 'Yes',
    sumatra: 'Yes',
  },
  {
    feature: 'Printing',
    cambuz: 'Yes',
    adobeReader: 'Yes',
    foxit: 'Yes',
    sumatra: 'Yes',
  },
  {
    feature: 'Platform availability',
    cambuz: 'Windows (stable), Linux & macOS (experimental)',
    adobeReader: 'Windows, macOS, Linux, mobile',
    foxit: 'Windows, macOS, Linux',
    sumatra: 'Windows',
  },
  {
    feature: 'Offline use',
    cambuz: 'Yes, opens local files without internet',
    adobeReader: 'Yes for local files',
    foxit: 'Yes for local files',
    sumatra: 'Yes',
  },
];
