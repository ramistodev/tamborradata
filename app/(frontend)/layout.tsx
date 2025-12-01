import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { LayoutContent } from './LayoutContent';
import { ReactQueryProvider } from './providers/ReactQueryProvider';

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
        <ReactQueryProvider>
          <LayoutContent>{children}</LayoutContent>
        </ReactQueryProvider>
        <SpeedInsights /> {/* Vercel Speed Insights */}
        <Analytics /> {/* Vercel Analytics */}
      </body>
    </html>
  );
}
