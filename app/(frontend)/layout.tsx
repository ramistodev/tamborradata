import './globals.css';
import type { Metadata } from 'next';
import { Header } from './components/Header/Header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

const siteUrl = 'https://tamborradata.com';
const imageUrl = `${siteUrl}/og-image.webp`;
const defaultTitle = 'Tamborradata | Datos y estadísticas de la Tamborrada Infantil';
const defaultDescription =
  'Explora datos y estadísticas de la Tamborrada Infantil de Donostia-San Sebastián: participación, nombres y colegios desde 2018.';

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}#organization`,
  name: 'Tamborradata',
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  image: imageUrl,
  sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
  description:
    'Proyecto de datos y estadísticas sobre la Tamborrada Infantil de Donostia-San Sebastián.',
};

const webSiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}#website`,
  url: siteUrl,
  name: 'Tamborradata',
  alternateName: 'Tamborradata Estadísticas',
  description: 'Tamborradata estadísticas y datos de la Tamborrada Infantil desde 2018.',
  inLanguage: 'es-ES',
  publisher: { '@id': `${siteUrl}#organization` },
  sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?name={search_term_string}`,
    'query-input': 'required name=search_term_string',
    name: 'Buscar participación en la Tamborrada Infantil',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  applicationName: 'Tamborradata',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: 'Tamborradata',
    images: [
      {
        url: imageUrl,
        alt: 'Tamborradata - datos de la Tamborrada Infantil',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: imageUrl,
        alt: 'Tamborradata - datos de la Tamborrada Infantil',
      },
    ],
    creator: '@tamborradata',
    site: '@tamborradata',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1549aa" />
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteStructuredData) }}
        />
      </head>
      <body>
        <Header />
        <main className="relative w-full min-h-screen m-0 px-3 sm:px-5 flex flex-col items-center justify-between">
          {children}
        </main>
        <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8 mb-5 sm:mb-1">
          <span>
            &copy; {new Date().getFullYear()} Tamborradata - Todos los derechos reservados.
          </span>
        </footer>
        <SpeedInsights /> {/* Vercel Speed Insights */}
        <Analytics /> {/* Vercel Analytics */}
      </body>
    </html>
  );
}
