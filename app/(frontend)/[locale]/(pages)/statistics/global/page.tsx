import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../../i18n/seo';
import { GlobalStructuredData } from '../../../config/structured-data/GlobalStructuredData';
import { GlobalPageContent } from './GlobalPageContent';

const imageUrl = 'https://tamborradata.com/og-image.webp';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Statistics.global');
  const title = t('title');
  const description = t('description');
  const alternates = getAlternates(locale, '/statistics/global');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'article',
      images: [{ url: imageUrl, alt: title }],
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
    alternates,
  };
}

export default function GlobalPage() {
  return (
    <>
      <GlobalStructuredData />
      <GlobalPageContent />
    </>
  );
}
