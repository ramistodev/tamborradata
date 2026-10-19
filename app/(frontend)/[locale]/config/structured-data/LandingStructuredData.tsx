import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import type { OverviewResponse } from '../../../../types/api/overview.types';
import { getAlternates, getLanguageTag } from '../../../i18n/seo';
import { buildLandingFaqs } from '../../(landing)/components/faq/faqs';
import { pressArticle } from '../../(landing)/components/press-mentions/pressArticle';
import { licenseUrl, ogImageUrl, organizationId, siteUrl, webSiteId } from '../constants';
import { PAGES_UPDATED, SITE_PUBLISHED, latestDate } from '../contentDates';
import { JsonLd } from './JsonLd';

/**
 * Structured data of the landing, as one `@graph` like the search page: the page, the dataset it
 * presents, its breadcrumb, its FAQ and the press mention. The FAQ comes from the same
 * `buildLandingFaqs` as the visible one and the texts from the same `buildLandingTexts` as the
 * metadata, so what Google reads is always what the page shows. Everything that depends on the
 * published period stays undefined without it, which `JSON.stringify` leaves out, so no property
 * ever states a made-up year.
 */
export async function LandingStructuredData({
  overview,
  pageTitle,
  pageDescription,
}: {
  overview: OverviewResponse | null;
  pageTitle: string;
  pageDescription: string;
}) {
  const [locale, t, tMetadata, tFaq, tEvent, tSearch, format] = await Promise.all([
    getLocale(),
    getTranslations('Landing.structuredData'),
    getTranslations('Landing.metadata'),
    getTranslations('Landing.faq.items'),
    getTranslations('Statistics.structuredData'),
    getTranslations('Search.structuredData'),
    getFormatter(),
  ]);

  const globalPeriod = overview?.globalPeriod;
  const url = getAlternates(locale, '/').canonical;
  const language = getLanguageTag(locale);
  const keywords = tMetadata('keywords')
    .split(',')
    .map((keyword) => keyword.trim());
  const dateModified = latestDate(PAGES_UPDATED, globalPeriod?.lastPublishedAt);

  const fromPeriod = globalPeriod && {
    description: t('datasetDescription', {
      startYear: String(globalPeriod.startYear),
      endYear: String(globalPeriod.endYear),
    }),
    temporalCoverage: `${globalPeriod.startYear}/${globalPeriod.endYear}`,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: `${siteUrl}/statistics/${globalPeriod.publicSlug}`,
        name: t('distributionName'),
      },
    ],
  };

  const ids = {
    webPage: `${url}#webpage`,
    dataset: `${url}#dataset`,
    breadcrumb: `${url}#breadcrumb`,
    faq: `${url}#faq`,
    press: `${url}#press-mentions`,
  };

  const webPage = {
    '@type': ['WebPage', 'CollectionPage'],
    '@id': ids.webPage,
    url,
    name: pageTitle,
    description: pageDescription,
    inLanguage: language,
    keywords,
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    isPartOf: { '@id': webSiteId },
    publisher: { '@id': organizationId },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl, width: 1200, height: 630 },
    image: ogImageUrl,
    about: [
      { '@type': 'Thing', name: 'Tamborradata' },
      { '@type': 'Thing', name: tEvent('eventSeriesName') },
      { '@type': 'Thing', name: t('aboutStatistics') },
    ],
    mainEntity: { '@id': ids.dataset },
    breadcrumb: { '@id': ids.breadcrumb },
    hasPart: [{ '@id': ids.faq }, { '@id': ids.press }],
    datePublished: SITE_PUBLISHED,
    dateModified,
  };

  const dataset = {
    '@type': 'Dataset',
    '@id': ids.dataset,
    name: t('datasetName'),
    description: fromPeriod?.description ?? t('datasetDescriptionFallback'),
    url,
    sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
    license: licenseUrl,
    isAccessibleForFree: true,
    creator: { '@id': organizationId },
    publisher: { '@id': organizationId },
    inLanguage: language,
    temporalCoverage: fromPeriod?.temporalCoverage,
    spatialCoverage: { '@type': 'Place', name: tEvent('place') },
    keywords,
    distribution: fromPeriod?.distribution,
    image: { '@type': 'ImageObject', url: ogImageUrl, width: 1200, height: 630 },
    datePublished: SITE_PUBLISHED,
    dateModified,
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb,
    itemListElement: [{ '@type': 'ListItem', position: 1, name: tSearch('home'), item: url }],
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': ids.faq,
    url,
    name: t('faqName'),
    description: t('faqDescription'),
    inLanguage: language,
    datePublished: SITE_PUBLISHED,
    dateModified,
    mainEntity: buildLandingFaqs(tFaq, format, overview).map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  // The article is in Spanish, whatever the language of the page
  const pressMentions = {
    '@type': 'ItemList',
    '@id': ids.press,
    name: t('pressName'),
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: 1,
    mentions: [{ '@id': organizationId }],
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'NewsArticle',
          url: pressArticle.url,
          headline: pressArticle.headline,
          inLanguage: 'es',
          datePublished: '2026-01-16T07:34:02+01:00',
          publisher: {
            '@type': 'Organization',
            name: 'Diario Vasco',
            url: 'https://www.diariovasco.com/',
          },
          author: {
            '@type': 'Person',
            name: pressArticle.author,
            url: 'https://www.diariovasco.com/autor/jorge-f-mendiola-709.html',
          },
          about: [
            { '@type': 'Thing', name: 'Tamborradata' },
            { '@type': 'Thing', name: tEvent('eventSeriesName') },
          ],
        },
      },
    ],
  };

  return (
    <JsonLd
      id="landing-structured-data"
      data={{
        '@context': 'https://schema.org',
        '@graph': [webPage, dataset, breadcrumb, faq, pressMentions],
      }}
    />
  );
}
