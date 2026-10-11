export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Is Cambuz PDF Reader completely free?',
    answer:
      'Yes. Cambuz PDF Reader is free to use with no subscription, no trial period, and no feature paywall. It is released under the MIT license.',
  },
  {
    question: 'Is there a subscription?',
    answer:
      'No. There is no subscription, no paid tier, and no in-app purchase. Cambuz is entirely free.',
  },
  {
    question: 'Which operating systems are supported?',
    answer:
      'Windows is the primary launch platform with stable installer and portable builds. Linux (AppImage) and macOS (Apple Silicon) builds are available as experimental builds that have not been fully validated on every distribution or hardware configuration.',
  },
  {
    question: 'Is there a portable Windows version?',
    answer:
      'Yes. In addition to the installer, a portable executable is available. It runs without installation, making it suitable for USB drives or environments where you cannot install software.',
  },
  {
    question: 'Does Cambuz work offline?',
    answer:
      'Cambuz is a desktop application. Once installed, it does not require an internet connection to open and read PDF files stored on your computer.',
  },
  {
    question: 'Can I search and copy PDF text?',
    answer:
      'Yes. Cambuz includes full-text search with result navigation, and you can select text within a PDF and copy it to the clipboard. Text extraction quality depends on how the PDF was created and its font encoding.',
  },
  {
    question: 'Does it support Hindi and Punjabi PDFs?',
    answer:
      'Cambuz can display Hindi and Punjabi PDF documents. Text extraction and copying from these documents may depend on the PDF\u2019s font encoding. Some PDFs embed fonts in a way that prevents accurate text extraction, which is a limitation of the document itself rather than the reader.',
  },
  {
    question: 'Does Cambuz include OCR?',
    answer:
      'Optional local OCR only. Scanned pages have no text layer, so Cambuz renders them as images. If a Tesseract 4+ executable is on your PATH, you can explicitly run "Recognize current page" — never automatic, with results in a separate box. Cambuz does not bundle, download or auto-run Tesseract, so scanned PDFs stay image-only without it.',
  },
  {
    question: 'Can I print PDFs?',
    answer:
      'Yes. Cambuz includes a print preview and standard printing workflow. You can print all pages or a specific page range to any installed printer.',
  },
  {
    question: 'Why can copied text from some PDFs be incorrect?',
    answer:
      'PDFs store text using font encoding maps. If a PDF uses a non-standard or custom encoding, the extracted text may not match what you see on screen. This is a property of the document, not the reader. Scanned PDFs that contain only images have no text layer to extract at all.',
  },
  {
    question: 'Why does Windows warn about an unsigned installer?',
    answer:
      'Cambuz builds are currently unsigned, which means Windows SmartScreen may show a warning. The installer is safe to run. Click \u201cMore info\u201d and then \u201cRun anyway\u201d to proceed. You should only do this for software you trust. Code signing may be added in future releases.',
  },
];
