import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../i18n/seo';
import { LandingStructuredData } from '../config/structured-data/LandingStructuredData';
import { ogImageUrl, siteName } from '../config/constants';
import { Landing } from './Landing';
import { buildLandingTexts } from './data/buildLandingTexts';
import { getOverview } from '../services/getOverview';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // The same cached calls the page makes, so nothing is fetched twice
  const [t, overview] = await Promise.all([
    getTranslations('Landing.metadata'),
    getOverview('both', true),
  ]);
  const { title, description } = buildLandingTexts(t, overview);
  const alternates = getAlternates(locale, '/');

  return {
    title,
    description,
    alternates,
    keywords: t('keywords'),
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName,
      images: [{ url: ogImageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
      site: '@tamborradata',
      creator: '@tamborradata',
    },
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
    category: 'website',
  };
}

export default async function LandingPage() {
  const [t, overview] = await Promise.all([
    getTranslations('Landing.metadata'),
    getOverview('both', true),
  ]);
  const { title, description } = buildLandingTexts(t, overview);

  return (
    <>
      <LandingStructuredData overview={overview} pageTitle={title} pageDescription={description} />

      <Landing overview={overview} />
    </>
  );
}
