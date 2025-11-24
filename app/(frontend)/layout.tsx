import './globals.css';
import type { Metadata } from 'next';
import { Header } from './components/Header/Header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'Tamborradata · Estadísticas y Datos de la Tamborrada Infantil',
    template: '%s | Tamborradata',
  },
  description:
    'Explora las estadísticas, nombres y colegios de la Tamborrada Infantil de San Sebastián.',

  openGraph: {
    title: 'Tamborradata · Datos y Estadísticas de la Tamborrada Infantil',
    description: 'Visita tamborradata.com y descubre las estadísticas de la Tamborrada Infantil.',
    url: 'https://tamborradata.com',
    siteName: 'Tamborradata',
    images: [
      {
        url: 'https://tamborradata.com/og-image.webp',
        alt: 'Tamborradata · Estadísticas de la Tamborrada Infantil',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tamborradata · Estadísticas de la Tamborrada Infantil',
    description: 'Análisis completo de la Tamborrada Infantil de San Sebastián.',
    images: ['https://tamborradata.com/og-image.webp'],
    creator: '@tamborradata',
    site: '@tamborradata',
  },

  metadataBase: new URL('https://tamborradata.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
              logo: 'https://tamborradata.com/favicon.ico',
              description:
                'Proyecto de análisis de datos sobre la Tamborrada Infantil de San Sebastián.',
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main className="relative w-full min-h-screen m-0 px-3 sm:px-5 flex flex-col items-center justify-between">
          {children}
        </main>
        <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8 mb-5 sm:mb-1">
          <span>© {new Date().getFullYear()} Tamborradata · Todos los derechos reservados.</span>
        </footer>
        <SpeedInsights /> {/* Vercel Speed Insights */}
        <Analytics /> {/* Vercel Analytics */}
      </body>
    </html>
  );
}
