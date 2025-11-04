import type { Metadata } from 'next';

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Tamborradata | Estadísticas de la Tamborrada Infantil ${year}`,
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
      `danborrada ${year}`,
      `tambor donostia ${year}`,
      `barrica tamborrada ${year}`,
      `listado participantes ${year}`,
      `escuelas tamborrada ${year}`,
      `análisis tamborrada ${year}`,
      `visualización datos ${year}`,
      `inteligencia artificial tamborrada ${year}`,
      `tendencias culturales ${year}`,
      `tradición donostiarra ${year}`,
      `fiestas san sebastián ${year}`,
      `enero donostia ${year}`,
      `santo tomás ${year}`,
      `cultura vasca ${year}`,
      `euskadi tradiciones ${year}`,
      `gipuzkoa fiestas ${year}`,
      `país vasco cultura ${year}`,
      `nombres populares ${year}`,
      `estadísticas infantiles ${year}`,
      `big data cultural ${year}`,
      `open data donostia ${year}`,
      `datos abiertos ${year}`,
      `machine learning cultura ${year}`,
      `AI análisis ${year}`,
      `evolución participación ${year}`,
      `ranking colegios ${year}`,
      `diversidad nombres ${year}`,
      `patrimonio cultural ${year}`,
    ],
    openGraph: {
      title: `Tamborradata | Estadísticas de la Tamborrada Infantil ${year}`,
      description: `Descubre los nombres más populares, colegios destacados y evolución de la Tamborrada Infantil ${year} en San Sebastián. Datos procesados con IA.`,
      url: `https://tamborradata.com/statistics/${year}`,
      images: [
        {
          url: 'https://tamborradata.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `Tamborradata | Estadísticas de la Tamborrada Infantil ${year}`,
        },
      ],
      type: 'article',
      publishedTime: `${year}-01-20T00:00:00.000Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tamborradata | Estadísticas de la Tamborrada Infantil ${year}`,
      description: `Nombres, colegios y tendencias de la Tamborrada Infantil ${year}. Análisis completo con visualizaciones interactivas.`,
      images: ['https://tamborradata.com/og-image.png'],
      creator: '@tamborradata',
      site: '@tamborradata',
    },
    alternates: {
      canonical: `https://tamborradata.com/statistics/${year}`,
    },
  };
}

export default function YearLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
