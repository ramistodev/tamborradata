import Script from 'next/script';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getLanguageTag } from '../../../../i18n/seo';
import { ogImageUrl } from '../../constants';
import { buildPeriodFacts } from './buildPeriodFacts';
import { buildPeriodGraph, presentVariables } from './buildPeriodGraph';
import { buildPeriodTexts } from './buildPeriodTexts';
import type { PeriodStructuredDataProps } from './types';

/**
 * Structured data of the full history: the series of editions is the event (an `EventSeries`) and
 * the page holds the data from the first to the last edition. The range comes from the list of
 * periods, so a new edition (or an older one found later) updates every text by itself.
 */
export async function GlobalStructuredData({ stats, periods }: PeriodStructuredDataProps) {
  const [locale, t, format] = await Promise.all([
    getLocale(),
    getTranslations('Statistics'),
    getFormatter(),
  ]);
  const { period, publishedAt, updatedAt } = stats.metaData;
  const facts = buildPeriodFacts(stats, periods);
  const { title, description } = buildPeriodTexts(facts, t, format);
  const range = { first: facts.firstPeriod, last: facts.lastPeriod };

  const url = getAlternates(locale, `/statistics/${period}`).canonical;

  const graph = buildPeriodGraph({
    url,
    language: getLanguageTag(locale),
    title,
    description,
    publishedAt,
    updatedAt,
    home: { name: t('structuredData.home'), url: getAlternates(locale, '/').canonical },
    statistics: {
      name: t('structuredData.statistics'),
      url: getAlternates(locale, '/statistics').canonical,
    },
    breadcrumbName: t('structuredData.breadcrumbGlobal'),
    about: {
      '@type': 'EventSeries',
      '@id': `${url}#event-series`,
      name: t('structuredData.eventSeriesName'),
      description: t('structuredData.eventSeriesDescription'),
      startDate: `${facts.firstPeriod}-01-20`,
      image: ogImageUrl,
      location: {
        '@type': 'Place',
        name: t('structuredData.place'),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Donostia / San Sebastián',
          addressRegion: 'Gipuzkoa',
          addressCountry: 'ES',
        },
      },
    },
    dataset: {
      name: title,
      description: t('structuredData.datasetGlobalDescription', range),
      temporalCoverage: `${facts.firstPeriod}/${facts.lastPeriod}`,
      keywords: t('structuredData.keywordsGlobal', range)
        .split(',')
        .map((keyword) => keyword.trim()),
      placeName: t('structuredData.place'),
      variableMeasured: presentVariables([
        [t('structuredData.variables.participants'), facts.participants],
        [t('structuredData.variables.record'), facts.recordCount],
        [t('structuredData.variables.distinctNames'), facts.distinctNames],
        [t('structuredData.variables.distinctSurnames'), facts.distinctSurnames],
        [t('structuredData.variables.multipleNames'), facts.multipleNames],
      ]),
    },
  });

  return (
    <Script
      id="period-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
