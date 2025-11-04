import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tamborradata | Estadísticas Globales e Históricas de la Tamborrada Infantil',
  description:
    'Análisis completo de la Tamborrada Infantil desde 2018: evolución histórica de colegios, nombres más populares, participación total y tendencias con inteligencia artificial. Datos procesados del Diario Vasco.',
  keywords: [
    'estadísticas globales tamborrada',
    'tamborrada infantil histórico',
    'evolución tamborrada donostia',
    'tendencias tamborrada infantil',
    'análisis histórico tamborrada',
    'datos completos tamborrada',
    'tamborrada desde 2018',
    'colegios tamborrada evolución',
    'nombres tamborrada histórico',
    'participación tamborrada años',
    'big data tamborrada',
    'inteligencia artificial cultura vasca',
    'visualización datos tamborrada',
    'estadísticas culturales donostia',
    'patrimonio datos tamborrada',
    'análisis longitudinal tamborrada',
    'trends tamborrada infantil',
    'dashboard tamborrada',
    'métricas culturales euskadi',
    'open data san sebastián',
  ],
  openGraph: {
    title: 'Tamborrada Infantil — Análisis Global y Tendencias Históricas',
    description:
      'Descubre la evolución completa de la Tamborrada Infantil de San Sebastián: nombres más populares por década, colegios destacados y análisis de tendencias desde 2018 con IA.',
    url: 'https://tamborradata.com/statistics/global',
    publishedTime: '2024-01-20T00:00:00Z', // Fecha del lanzamiento del sitio
    modifiedTime: new Date().toISOString(), // Última actualización de datos
    images: [
      {
        url: '/og-image.png',
        width: 800,
        height: 800,
        alt: 'Estadísticas Globales Tamborrada Infantil - Análisis Histórico Tamborradata',
      },
    ],
    type: 'article',
    siteName: 'Tamborradata',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamborrada Infantil — Dashboard Global de Estadísticas',
    description:
      'Evolución histórica completa: nombres, colegios y tendencias de la Tamborrada Infantil desde 2018. Análisis con IA y visualizaciones interactivas.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://tamborradata.com/statistics/global',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
