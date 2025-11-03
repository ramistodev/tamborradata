import type { Metadata } from 'next';

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Tamborrada Infantil ${year} — Estadísticas y Datos | Tamborradata`,
    description: `Análisis completo de la Tamborrada Infantil ${year}: nombres más populares, colegios participantes, evolución respecto años anteriores y tendencias con visualizaciones interactivas.`,
    keywords: [
      `tamborrada ${year}`,
      `tamborrada infantil ${year}`,
      `estadísticas tamborrada ${year}`,
      `nombres tamborrada ${year}`,
      `colegios tamborrada ${year}`,
      `datos tamborrada ${year}`,
      `san sebastián ${year}`,
      `donostia ${year}`,
      `participantes tamborrada ${year}`,
    ],
    openGraph: {
      title: `Tamborrada Infantil ${year} — Análisis y Estadísticas Completas`,
      description: `Descubre los nombres más populares, colegios destacados y evolución de la Tamborrada Infantil ${year} en San Sebastián. Datos procesados con IA.`,
      url: `https://tamborradata.com/statistics/${year}`,
      images: [
        {
          url: '/assets/og-image.png',
          width: 1200,
          height: 630,
          alt: `Estadísticas Tamborrada Infantil ${year} - Tamborradata`,
        },
      ],
      type: 'article',
      publishedTime: `${year}-01-20T00:00:00.000Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tamborrada Infantil ${year} — Datos y Análisis`,
      description: `Nombres, colegios y tendencias de la Tamborrada Infantil ${year}. Análisis completo con visualizaciones interactivas.`,
      images: ['/assets/og-image.png'],
    },
    alternates: {
      canonical: `https://tamborradata.com/statistics/${year}`,
    },
  };
}

export default function YearLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
