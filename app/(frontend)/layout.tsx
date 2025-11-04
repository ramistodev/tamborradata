import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: {
    default: 'Tamborradata | Estadísticas y Datos de la Tamborrada Infantil',
    template: '%s | Tamborradata',
  },
  description:
    'Explora las estadísticas, nombres y colegios de la Tamborrada Infantil de San Sebastián. Análisis de datos desde 2018 con IA y visualizaciones interactivas.',
  keywords: [
    'tamborrada',
    'datos tamborrada',
    'estadísticas tamborrada infantil',
    'donostia',
    'san sebastián',
    'nombres tamborrada',
    'colegios tamborrada',
    'participantes tamborrada',
    'tamborradata',
    'tamborrada datos',
    'tamborrada estadísticas',
    'tamborrada infantil san sebastián',
    'tamborrada donostia',
    'gipuzkoa tamborrada',
    'euskadi tamborrada',
    'país vasco tamborrada',
    'tradición donostiarra',
    'cultura vasca',
    'fiestas san sebastián',
    'enero donostia',
    'santo tomás',
    'tamborrada escuelas',
    'tamborrada colegios',
    'niños tamborrada',
    'infantil donostia',
    'análisis datos tamborrada',
    'inteligencia artificial tamborrada',
    'big data euskadi',
    'visualización datos',
    'estadísticas culturales',
    'open data donostia',
    'datos abiertos',
    'machine learning cultura',
    'AI análisis cultural',
    'tambor donostia',
    'barrica tamborrada',
    'txistulari',
    'danborrada',
    'atabal',
    'diario vasco tamborrada',
    'listados tamborrada',
    'participación tamborrada',
    'evolución tamborrada',
    'tendencias culturales',
    'patrimonio cultural vasco',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.ico', sizes: '16x16' },
    ],
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Tamborradata | Datos y Estadísticas de la Tamborrada Infantil',
    description:
      'Visita tamborradata.com y descubre las estadísticas de la Tamborrada Infantil de San Sebastián: nombres más comunes, colegios participantes y tendencias desde 2018.',
    url: 'https://tamborradata.com',
    siteName: 'Tamborradata',
    images: [
      {
        url: 'https://tamborradata.com/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tamborradata | Estadísticas de la Tamborrada Infantil',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamborradata | Estadísticas de la Tamborrada Infantil',
    description:
      'Análisis completo de la Tamborrada Infantil de San Sebastián: datos, colegios, nombres, tendencias y más.',
    images: ['https://tamborradata.com/assets/og-image.png'],
    creator: '@tamborradata',
    site: '@tamborradata',
  },
  alternates: {
    canonical: 'https://tamborradata.com',
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
      <body className="min-h-screen m-0 px-5 flex flex-col items-center justify-between">
        {children}
        <footer className="w-full text-center text-sm text-(--color-text-secondary) py-2 mt-8">
          <span>© {new Date().getFullYear()} Tamborradata · Todos los derechos reservados.</span>
        </footer>
        <SpeedInsights /> {/* Vercel Speed Insights */}
      </body>
    </html>
  );
}
