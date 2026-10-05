import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../../i18n/seo';
import { PeriodPageContent } from './PeriodPageContent';
import { PeriodStructuredData } from '../../../config/structured-data/YearStructuredData';
import { getStatistics } from '../../../services/getStatistics';
import { getPeriods } from '../../../services/getPeriods';

// Recogemos el parámetro dinámico
export async function generateMetadata({
  params,
}: {
  params: Promise<{ period: string }>;
}): Promise<Metadata> {
  const { period } = await params;
  const locale = await getLocale();
  const t = await getTranslations('Statistics.period');
  const title = t('title', { period });
  const description = t('description', { period });
  const alternates = getAlternates(locale, `/statistics/${period}`);
  const imageUrl = 'https://tamborradata.com/og-image.webp';
  // Same cached call the page makes, so this does not fetch twice
  const { metaData } = await getStatistics(period, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'article',
      publishedTime: metaData.publishedAt,
      modifiedTime: metaData.updatedAt,
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

export default async function PeriodPage({ params }: { params: Promise<{ period: string }> }) {
  const { period } = await params;
  const stats = await getStatistics(period, await getLocale());
  const periods = await getPeriods();

  return (
    <>
      <PeriodStructuredData
        period={period}
        publishedAt={stats.metaData.publishedAt}
        updatedAt={stats.metaData.updatedAt}
      />
      <PeriodPageContent periods={periods} stats={stats} />
    </>
  );
}
