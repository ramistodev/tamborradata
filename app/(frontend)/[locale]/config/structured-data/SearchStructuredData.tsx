import Script from 'next/script';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import type { OverviewResponse } from '../../../../types/api/overview.types';
import { getAlternates, getLanguageTag } from '../../../i18n/seo';
import { buildFaqs } from '../../(pages)/search/data/faqs';
import { buildSearchTexts } from '../../(pages)/search/data/buildSearchTexts';
import { ogImageUrl, organizationId, webSiteId } from '../constants';

type SearchStructuredDataProps = {
  period: NonNullable<OverviewResponse['globalPeriod']>;
};

/** First publication date of the page (ISO 8601). A fixed value chosen by the owner, never derived. */
const DATE_PUBLISHED = '2025-12-16T00:00:00.000Z';

/**
 * Structured data of the search page, as one `@graph` like the period pages: the page, the search
 * tool it offers (WebApplication), the event series the searched people took part in, its
 * breadcrumb and its FAQ. The FAQ comes from the same `buildFaqs` as the visible one and the
 * texts from the same `buildSearchTexts` as the metadata, so what Google reads is always what the
 * page shows. No `Dataset`: the participants can only be searched, not downloaded, and have no
 * license, so the page does not claim to publish a dataset.
 */
export async function SearchStructuredData({ period }: SearchStructuredDataProps) {
  const [locale, t, tMetadata, tFaq, tEvent, format] = await Promise.all([
    getLocale(),
    getTranslations('Search'),
    getTranslations('Search.metadata'),
    getTranslations('Search.faq.items'),
    getTranslations('Statistics.structuredData'),
    getFormatter(),
  ]);

  const url = getAlternates(locale, '/search').canonical;
  const language = getLanguageTag(locale);
  const { title, description } = buildSearchTexts(tMetadata, period);
  const years = { startYear: String(period.startYear), endYear: String(period.endYear) };
  const ids = {
    webPage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
    faq: `${url}#faq`,
    app: `${url}#search-tool`,
    eventSeries: `${url}#event-series`,
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': ids.webPage,
    url,
    name: title,
    description,
    inLanguage: language,
    keywords: t('structuredData.keywords')
      .split(',')
      .map((keyword) => keyword.trim()),
    isAccessibleForFree: true,
    isPartOf: { '@id': webSiteId },
    publisher: { '@id': organizationId },
    about: { '@id': ids.eventSeries },
    mainEntity: { '@id': ids.app },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl },
    breadcrumb: { '@id': ids.breadcrumb },
    hasPart: { '@id': ids.faq },
    datePublished: DATE_PUBLISHED,
    dateModified: period.lastPublishedAt,
  };

  const app = {
    '@type': 'WebApplication',
    '@id': ids.app,
    url,
    name: t('structuredData.appName'),
    description: t('structuredData.appDescription', years),
    inLanguage: language,
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    temporalCoverage: `${period.startYear}/${period.endYear}`,
    about: { '@id': ids.eventSeries },
    creator: { '@id': organizationId },
    publisher: { '@id': organizationId },
    mainEntityOfPage: { '@id': ids.webPage },
    datePublished: DATE_PUBLISHED,
    dateModified: period.lastPublishedAt,
  };

  const eventSeries = {
    '@type': 'EventSeries',
    '@id': ids.eventSeries,
    name: tEvent('eventSeriesName'),
    description: tEvent('eventSeriesDescription'),
    startDate: `${period.startYear}-01-20`,
    image: ogImageUrl,
    location: {
      '@type': 'Place',
      name: tEvent('place'),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Donostia / San Sebastián',
        addressRegion: 'Gipuzkoa',
        addressCountry: 'ES',
      },
    },
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('structuredData.home'),
        item: getAlternates(locale, '/').canonical,
      },
      { '@type': 'ListItem', position: 2, name: t('title'), item: url },
    ],
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': ids.faq,
    url,
    inLanguage: language,
    mainEntity: buildFaqs(tFaq, format, period).map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <Script
      id="search-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [webPage, app, eventSeries, breadcrumb, faq],
        }),
      }}
    />
  );
}
