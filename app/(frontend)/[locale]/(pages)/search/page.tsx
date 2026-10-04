import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../i18n/seo';
import { SearchPageContent } from './SearchPageContent';
import { SearchStructuredData } from '../../config/structured-data/SearchStructuredData';

const imageUrl = 'https://tamborradata.com/og-image.webp';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Search.metadata');
  const title = t('title');
  const description = t('description');
  const alternates = getAlternates(locale, '/search');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      images: [{ url: imageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      siteName: 'Tamborradata',
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'standard',
        'max-snippet': 150,
        'max-video-preview': -1,
      },
    },
  };
}

export default function SearchPage() {
  return (
    <>
      <SearchStructuredData />
      <SearchPageContent />
    </>
  );
}
