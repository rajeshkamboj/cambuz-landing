import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { DownloadPage } from '@/pages/DownloadPage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { AboutPage } from '@/pages/AboutPage';
import { WindowsPage } from '@/pages/WindowsPage';
import { LightweightPage } from '@/pages/LightweightPage';
import { OfflinePage } from '@/pages/OfflinePage';
import { HindiPunjabiPage } from '@/pages/HindiPunjabiPage';
import { PrintPage } from '@/pages/PrintPage';
import { AlternativesPage } from '@/pages/AlternativesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/download/" element={<DownloadPage />} />
          <Route path="/features/" element={<FeaturesPage />} />
          <Route path="/about/" element={<AboutPage />} />
          <Route path="/free-pdf-reader-windows/" element={<WindowsPage />} />
          <Route path="/lightweight-pdf-reader/" element={<LightweightPage />} />
          <Route path="/offline-pdf-reader/" element={<OfflinePage />} />
          <Route path="/read-hindi-punjabi-pdf/" element={<HindiPunjabiPage />} />
          <Route path="/print-pdf-windows/" element={<PrintPage />} />
          <Route path="/free-pdf-reader-alternatives/" element={<AlternativesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
