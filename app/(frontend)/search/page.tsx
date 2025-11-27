import { Metadata } from 'next';
import { SearchProvider } from './context/SearchProvider';
import { SearchPageContent } from './SearchPageContent';
import { SearchStructuredData } from './SearchStructuredData';

const pageTitle = 'Busca tu participación en la Tamborrada Infantil';
const pageDescription =
  'Consulta tu historial de participación: años, compañía y apariciones en la Tamborrada Infantil desde 2018.';
const canonicalUrl = 'https://tamborradata.com/search';
const imageUrl = 'https://tamborradata.com/og-image.webp';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    type: 'website',
    images: [{ url: imageUrl, alt: pageTitle }],
    locale: 'es_ES',
    siteName: 'Tamborradata',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'standard',
      'max-snippet': 150,
      'max-video-preview': -1,
    },
  },
};

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchStructuredData />
      <SearchPageContent />
    </SearchProvider>
  );
}
