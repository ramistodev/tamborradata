import type { Metadata } from 'next';
import { YearProvider } from './context/YearProvider';
import { YearPageContent } from './YearPageContent';
import { YearStructuredData } from './YearStructuredData';

// Recogemos el parámetro dinámico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `Tamborrada Infantil ${year} · Estadísticas`,
    description: `Estadísticas completas de la Tamborrada Infantil ${year}: nombres más comunes, apellidos, colegios, participación total y tendencias de este año.`,
    openGraph: {
      title: `Tamborrada Infantil ${year} · Estadísticas`,
      description: `Descubre los datos oficiales de la Tamborrada Infantil ${year}: participación, nombres, colegios destacados y evolución anual.`,
      url: `https://tamborradata.com/statistics/${year}`,
      images: [
        {
          url: 'https://tamborradata.com/og-image.webp',
          alt: `Tamborrada Infantil ${year} · Estadísticas`,
        },
      ],
    },
    twitter: {
      title: `Tamborrada Infantil ${year} · Estadísticas`,
      description: `Resumen de datos de la Tamborrada Infantil ${year}: nombres, colegios y participación total.`,
      images: ['https://tamborradata.com/og-image.webp'],
    },
    alternates: {
      canonical: `https://tamborradata.com/statistics/${year}`,
    },
  };
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  return (
    <YearProvider year={year}>
      <YearStructuredData year={year} />
      <YearPageContent />
    </YearProvider>
  );
}
