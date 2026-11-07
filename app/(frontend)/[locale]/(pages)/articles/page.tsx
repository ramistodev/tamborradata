import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '@/app/(frontend)/i18n/seo';
import { ogImageUrl, siteName } from '../../config/constants';
import { PageContent } from './PageContent';

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Articles.metadata')]);

  const title = `${t('title')} | ${siteName}`;
  const description = t('description');
  const alternates = getAlternates(locale, '/articles');

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName,
      type: 'website',
      images: [{ url: ogImageUrl, alt: title }],
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

export default function ArticlesPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <PageContent />
    </div>
  );
}
