import Script from 'next/script';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getLanguageTag } from '../../../i18n/seo';

export async function PeriodStructuredData({
  period,
  publishedAt,
  updatedAt,
}: {
  period: string;
  /** ISO date strings straight from the period metadata */
  publishedAt: string;
  updatedAt: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations('Statistics');

  const pageTitle = t('period.title', { period });
  const pageDescription = t('period.description', { period });
  const canonicalUrl = getAlternates(locale, `/statistics/${period}`).canonical;
  const statisticsUrl = getAlternates(locale, '/statistics').canonical;
  const homeUrl = getAlternates(locale, '/').canonical;
  const language = getLanguageTag(locale);
  const publicationDate = `${period}-01-20`;
  const imageUrl = 'https://tamborradata.com/og-image.webp';

  const datasetStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: pageTitle,
    description: t('structuredData.datasetDescription', { description: pageDescription }),
    url: canonicalUrl,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    temporalCoverage: publicationDate,
    inLanguage: language,
    spatialCoverage: {
      '@type': 'Place',
      name: 'Donostia / San Sebastián, Gipuzkoa',
    },
    creator: {
      '@type': 'Person',
      name: 'Ramistodev',
      url: 'https://tamborradata.com',
    },
  };

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    author: {
      '@type': 'Person',
      name: 'Ramistodev',
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    mainEntityOfPage: canonicalUrl,
    image: imageUrl,
    inLanguage: language,
    publisher: {
      '@type': 'Organization',
      name: 'Tamborradata',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tamborradata.com/favicon.ico',
      },
    },
  };

  const webpageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    url: canonicalUrl,
    description: pageDescription,
    image: imageUrl,
    inLanguage: language,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('structuredData.home'), item: homeUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('structuredData.statistics'),
          item: statisticsUrl,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: t('structuredData.breadcrumbPeriod', { period }),
          item: canonicalUrl,
        },
      ],
    },
  };

  const faqEntries = [
    ['namesQuestion', t('structuredData.namesAnswer', { period })],
    ['surnamesQuestion', t('structuredData.surnamesAnswer', { period })],
    ['schoolsQuestion', t('structuredData.schoolsAnswer', { period })],
    ['newNamesQuestion', t('structuredData.newNamesAnswer', { period })],
    ['participantsQuestion', t('structuredData.participantsAnswer', { period })],
    ['summaryQuestion', pageDescription],
  ] as const;

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: faqEntries.map(([question, answer]) => ({
      '@type': 'Question',
      name: t(`structuredData.${question}`, { period }),
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="dataset-period-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />

      <Script
        id="article-period-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <Script
        id="webpage-period-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageStructuredData) }}
      />

      <Script
        id="faq-period-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
