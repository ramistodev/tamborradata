import type { Metadata } from 'next';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../../i18n/seo';
import { PeriodPageContent } from './PeriodPageContent';
import { ogImageUrl, siteName } from '../../../config/constants';
import { buildPeriodFacts } from '../../../config/structured-data/period/buildPeriodFacts';
import { buildPeriodTexts } from '../../../config/structured-data/period/buildPeriodTexts';
import { PeriodStructuredData } from '../../../config/structured-data/PeriodStructuredData';
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
  // The same cached calls the page makes, so nothing is fetched twice
  const [t, format, stats, periods] = await Promise.all([
    getTranslations('Statistics'),
    getFormatter(),
    getStatistics(period, locale),
    getPeriods(),
  ]);
  const { metaData } = stats;
  const { title, description } = buildPeriodTexts(buildPeriodFacts(stats, periods), t, format);
  const alternates = getAlternates(locale, `/statistics/${period}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName,
      type: 'article',
      publishedTime: metaData.publishedAt,
      modifiedTime: metaData.updatedAt,
      images: [
        {
          url: ogImageUrl,
          alt: title,
        },
      ],
      ...getOpenGraphLocales(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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
      <PeriodStructuredData stats={stats} periods={periods} />
      <PeriodPageContent periods={periods} stats={stats} />
    </>
  );
}
