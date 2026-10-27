import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getLanguageTag } from '../../../../i18n/seo';
import { ogImageUrl } from '../../constants';
import { JsonLd } from '../JsonLd';
import { buildPeriodFacts } from './buildPeriodFacts';
import { buildPeriodGraph, presentVariables } from './buildPeriodGraph';
import { buildPeriodTexts } from './buildPeriodTexts';
import type { PeriodStructuredDataProps } from './types';

/** Structured data of one yearly edition: the edition is the event, the page its statistics. */
export async function YearStructuredData({ stats, periods }: PeriodStructuredDataProps) {
  const [locale, t, format] = await Promise.all([
    getLocale(),
    getTranslations('Statistics'),
    getFormatter(),
  ]);
  const { period, publishedAt, updatedAt } = stats.metaData;
  const facts = buildPeriodFacts(stats, periods);
  const { title, description } = buildPeriodTexts(facts, t, format);

  const url = getAlternates(locale, `/statistics/${period}`).canonical;
  // The Tamborrada Infantil is held every January 20
  const eventDate = `${period}-01-20`;

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
    breadcrumbName: t('structuredData.breadcrumbPeriod', { period }),
    about: {
      '@type': 'Event',
      '@id': `${url}#event`,
      name: t('structuredData.eventName', { period }),
      description: t('structuredData.eventDescription', { period }),
      startDate: eventDate,
      endDate: eventDate,
      organizer: {
        '@type': 'GovernmentOrganization',
        name: 'Ayuntamiento de Donostia / San Sebastián',
        url: 'https://www.donostia.eus',
      },
      performer: { '@type': 'PerformingGroup', name: t('structuredData.performerName') },
      // Watching the parade in the street is free
      offers: {
        '@type': 'Offer',
        url,
        price: 0,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: publishedAt,
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
      description: t('structuredData.datasetDescription', { period }),
      temporalCoverage: eventDate,
      keywords: t('structuredData.keywords', { period })
        .split(',')
        .map((keyword) => keyword.trim()),
      placeName: t('structuredData.place'),
      variableMeasured: presentVariables([
        [t('structuredData.variables.participants'), facts.participants],
        [t('structuredData.variables.growth'), facts.growth, '%'],
        [t('structuredData.variables.distinctNames'), facts.distinctNames],
        [t('structuredData.variables.distinctSurnames'), facts.distinctSurnames],
        [t('structuredData.variables.multipleNames'), facts.multipleNames],
        [t('structuredData.variables.averageSchoolSize'), facts.averageSchoolSize],
        [t('structuredData.variables.schoolCount'), facts.schoolCount],
      ]),
    },
  });

  return <JsonLd id="period-structured-data" data={graph} />;
}
