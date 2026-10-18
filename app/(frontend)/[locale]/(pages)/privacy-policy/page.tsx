import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '../../../i18n/seo';
import { ogImageUrl, siteName } from '../../config/constants';
import { PolicyPrivacyStructuredData } from '../../config/structured-data/PolicyPrivacyStructuredData';
import { PageContent } from './PageContent';
import { PRIVACY_POLICY_PUBLISHED, PRIVACY_POLICY_UPDATED } from './data/constants';

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('PrivacyPolicy.metadata')]);

  const title = `${t('title')} | ${siteName}`;
  const description = t('description');
  const alternates = getAlternates(locale, '/privacy-policy');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'article',
      publishedTime: PRIVACY_POLICY_PUBLISHED,
      modifiedTime: PRIVACY_POLICY_UPDATED,
      images: [{ url: ogImageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <PolicyPrivacyStructuredData />
      <PageContent />
    </>
  );
}
