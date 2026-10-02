import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { StructuredData } from './config/structured-data/StructuredData';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { LayoutContent } from './LayoutContent';
import { orbitron, spaceGrotesk, jetbrainsMono } from './config/fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1549aa" />
        <StructuredData />
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

// Metadata
const siteUrl = 'https://tamborradata.com';
const imageUrl = `${siteUrl}/og-image.webp`;
const defaultTitle = 'Tamborradata | Datos y estadísticas de la Tamborrada Infantil';
const defaultDescription =
  'Explora datos y estadísticas de la Tamborrada Infantil de Donostia-San Sebastián: participación, nombres y colegios desde 2018.';

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
