import type { Metadata } from 'next';
import { YearPageContent } from './YearPageContent';
import { YearStructuredData } from './YearStructuredData';

// Recogemos el parámetro dinámico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const pageTitle = `Estadísticas de la Tamborrada Infantil ${year}`;
  const pageDescription = `Análisis de la Tamborrada Infantil ${year}: participantes, nombres más comunes, colegios destacados y tendencias anuales.`;
  const canonicalUrl = `https://tamborradata.com/statistics/${year}`;
  const imageUrl = 'https://tamborradata.com/og-image.webp';

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      site: '@tamborradata',
      creator: '@tamborradata',
    },
  };
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  return (
    <>
      <YearStructuredData year={year} />
      <YearPageContent />
    </>
  );
}
