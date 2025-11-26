import { Metadata } from 'next';
import { HomeStructuredData } from './HomeStructuredData';
import { HomePageContent } from './HomePageContent';

const siteUrl = 'https://tamborradata.com';
const canonicalUrl = siteUrl;
const imageUrl = `${siteUrl}/og-image.webp`;
const pageTitle = 'Tamborradata | Datos y estadísticas de la Tamborrada Infantil';
const pageDescription =
  'Tamborradata es la página oficial para explorar datos y estadísticas verificadas de la Tamborrada Infantil en Donostia-San Sebastián: participación, nombres, colegios y tendencias desde 2018.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  keywords: [
    'Tamborradata',
    'Tamborrada Infantil',
    'estadísticas Tamborrada',
    'datos oficiales Tamborrada',
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: 'Tamborradata',
    images: [
      {
        url: imageUrl,
        alt: 'Tamborradata - datos y estadísticas de la Tamborrada Infantil',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: imageUrl,
        alt: 'Tamborradata - datos y estadísticas de la Tamborrada Infantil',
      },
    ],
    site: '@tamborradata',
    creator: '@tamborradata',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'website',
};

export default function Home() {
  return (
    <>
      <HomeStructuredData
        siteUrl={siteUrl}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        imageUrl={imageUrl}
      />

      <HomePageContent />
    </>
  );
}
