import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../i18n/seo';
import { LandingStructuredData } from '../config/structured-data/LandingStructuredData';
import { Landing } from './Landing';

const siteUrl = 'https://tamborradata.com';
const imageUrl = `${siteUrl}/og-image.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Landing.metadata');
  const title = t('title');
  const description = t('description');
  const alternates = getAlternates(locale, '/');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates,
    keywords: t('keywords'),
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: 'Tamborradata',
      images: [{ url: imageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
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
  const t = await getTranslations('Landing.metadata');

  return (
    <>
      <LandingStructuredData
        siteUrl={siteUrl}
        pageTitle={t('title')}
        pageDescription={t('description')}
        imageUrl={imageUrl}
      />

      <Landing />
    </>
  );
}
