import { Metadata } from 'next';
import { GlobalStructuredData } from './GlobalStructuredData';
import { GlobalProvider } from './context/GlobalProvider';
import { GlobalPageContent } from './GlobalPageContent';

const pageTitle = 'Estadísticas globales de la Tamborrada Infantil';
const pageDescription =
  'Análisis global de la Tamborrada Infantil desde 2018: evolución de nombres, colegios, participación y tendencias culturales año a año.';
const canonicalUrl = 'https://tamborradata.com/statistics/global';
const imageUrl = 'https://tamborradata.com/og-image.webp';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    type: 'article',
    images: [{ url: imageUrl, alt: pageTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [imageUrl],
    site: '@tamborradata',
    creator: '@tamborradata',
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

export default function GlobalPage() {
  return (
    <GlobalProvider>
      <GlobalStructuredData />
      <GlobalPageContent />
    </GlobalProvider>
  );
}
