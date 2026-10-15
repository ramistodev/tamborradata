import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../i18n/seo';
import { getSchools } from '../../services/getSchools';
import { SearchPageContent } from './SearchPageContent';
import { buildSearchTexts } from './data/buildSearchTexts';
import { SearchStructuredData } from '../../config/structured-data/SearchStructuredData';
import { ogImageUrl, siteName } from '../../config/constants';
import { overviewScope } from '../../../../types/api/overview.types';
import { getOverview } from '../../services/getOverview';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // The same cached calls the page makes, so nothing is fetched twice
  const [t, overview] = await Promise.all([
    getTranslations('Search.metadata'),
    getOverview(overviewScope.global, true),
  ]);

  const { title, description } = buildSearchTexts(t, overview?.globalPeriod);
  const alternates = getAlternates(locale, '/search');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      images: [{ url: ogImageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@tamborradata',
      creator: '@tamborradata',
    },
    alternates,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function SearchPage() {
  const [schools, overview] = await Promise.all([
    getSchools(),
    getOverview(overviewScope.global, true),
  ]);

  return (
    <>
      <SearchStructuredData globalPeriod={overview?.globalPeriod} />
      <SearchPageContent schools={schools} overview={overview} />
    </>
  );
}
