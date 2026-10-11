/*
 * Generated from cambuz-pdf/docs/landing-content.json by
 * scripts/sync-cambuz-release.mjs. Change feature copy in the app repository,
 * then let the release sync publish it here.
 *
 * This checked-in seed keeps the existing published site deterministic until
 * the first automatic app build is released.
 */

import type { Feature } from './features';

export const generatedFeatures = [
  {
    id: 'reading',
    headline: 'Just you and the document.',
    description:
      'Cambuz opens PDFs in a clean reading interface with nothing competing for your attention. Navigate pages, zoom in and out, and switch between fit modes to read comfortably at any size.',
    bullets: [
      'Continuous scrolling and page-by-page navigation',
      'Zoom controls with fit-width and fit-page modes',
      'Thumbnail sidebar for quick page jumping',
      'Dark reading surface for low-light environments',
    ],
    screenshotAlt: 'Cambuz PDF Reader showing a clean document view with page navigation controls',
    screenshotCaption: 'The main reading interface with page navigation and zoom controls',
    icon: 'BookOpen',
    screenshotId: 'reading',
  },
  {
    id: 'search',
    headline: 'Search less. Find more.',
    description:
      'Find any word or phrase across an entire PDF. Cambuz highlights every match and lets you jump between results without losing your place.',
    bullets: [
      'Full-text search across the entire document',
      'Highlighted match results with context',
      'Next and previous result navigation',
      'Match counter showing total results found',
    ],
    screenshotAlt: 'Cambuz PDF Reader search panel with highlighted search results in a document',
    screenshotCaption: 'Search results highlighted with navigation between matches',
    icon: 'Search',
    screenshotId: 'search',
  },
  {
    id: 'selection',
    headline: 'Select. Copy. Keep moving.',
    description:
      'Select text directly in the PDF and copy it to the clipboard for use anywhere. Cambuz extracts the text embedded in the document so you can paste it into notes, emails, or any other application.',
    bullets: [
      'Click and drag to select text',
      'Keyboard shortcut to copy selected text',
      'Works with standard text-based PDFs',
      'Selection quality depends on document font encoding',
    ],
    screenshotAlt: 'Cambuz PDF Reader with text selected in a document ready for copying',
    screenshotCaption: 'Text selection in a PDF document ready to copy',
    icon: 'MousePointer2',
    screenshotId: 'selection',
  },
  {
    id: 'print',
    headline: 'From PDF to paper.',
    description:
      'Print any PDF directly from Cambuz with a standard print preview. Choose your printer, select a page range, and send it to paper without leaving the reader.',
    bullets: [
      'Print preview before committing to paper',
      'Select specific pages or page ranges',
      'Works with any installed Windows printer',
      'Standard print dialog with paper size options',
    ],
    screenshotAlt: 'Cambuz PDF Reader print preview dialog showing page range options',
    screenshotCaption: 'Print preview with page range selection',
    icon: 'Printer',
    screenshotId: 'print',
  },
  {
    id: 'languages',
    headline: 'Made for the documents you actually read.',
    description:
      'Cambuz displays Hindi and Punjabi PDF documents correctly. Text extraction from these documents depends on the font encoding used when the PDF was created.',
    bullets: [
      'Renders Hindi (Devanagari) script PDFs',
      'Renders Punjabi (Gurmukhi) script PDFs',
      'Displays embedded fonts as authored',
      'Text extraction depends on document encoding',
    ],
    screenshotAlt: 'Cambuz PDF Reader displaying a Hindi language PDF document in Devanagari script',
    screenshotCaption: 'A Hindi-language PDF rendered in Cambuz',
    icon: 'Languages',
    screenshotId: 'languages',
  },
  {
    id: 'desktop',
    headline: 'A desktop tool, not another upload form.',
    description:
      'Cambuz is a desktop application. It opens files from your computer. It is not a browser-based PDF editor or an upload service. You install it once and use it locally.',
    bullets: [
      'Native desktop application for Windows',
      'Opens files from your local filesystem',
      'No browser tab or upload required',
      'No account or sign-in needed',
    ],
    screenshotAlt: 'Cambuz PDF Reader desktop application window on Windows',
    screenshotCaption: 'Cambuz running as a native desktop application',
    icon: 'Monitor',
    screenshotId: 'desktop',
  },
] satisfies readonly Feature[];
