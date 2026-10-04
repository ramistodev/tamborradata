import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../../i18n/seo';
import { YearPageContent } from './YearPageContent';
import { YearStructuredData } from '../../../config/structured-data/YearStructuredData';

// Recogemos el parámetro dinámico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const locale = await getLocale();
  const t = await getTranslations('Statistics.year');
  const title = t('title', { year });
  const description = t('description', { year });
  const alternates = getAlternates(locale, `/statistics/${year}`);
  const imageUrl = 'https://tamborradata.com/og-image.webp';

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'article',
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      ...getOpenGraphLocales(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
