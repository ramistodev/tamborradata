import { ogImageUrl, organizationId, webSiteId } from '../../constants';

export type PropertyValueInput = { name: string; value: number; unitText?: string };

type PeriodGraphInput = {
  url: string;
  language: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  home: { name: string; url: string };
  statistics: { name: string; url: string };
  breadcrumbName: string;
  /** The real-world thing the page is about: an edition (Event) or the whole series (EventSeries). */
  about: Record<string, unknown> & { '@id': string };
  dataset: {
    name: string;
    description: string;
    temporalCoverage: string;
    keywords: string[];
    variableMeasured: PropertyValueInput[];
    placeName: string;
  };
};

const LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';

/**
 * One `@graph` per page, with every node pointing at the others by `@id`: the page (WebPage) has a
 * dataset (Dataset) about an event, sits under a breadcrumb, belongs to the site and is published
 * by the organization. A single connected graph tells Google what this page *is*; four loose
 * blocks would only list properties.
 */
export function buildPeriodGraph(input: PeriodGraphInput) {
  const { url } = input;
  const ids = {
    webPage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
    dataset: `${url}#dataset`,
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': ids.webPage,
    url,
    name: input.title,
    description: input.description,
    inLanguage: input.language,
    isPartOf: { '@id': webSiteId },
    publisher: { '@id': organizationId },
    about: input.about,
    mainEntity: { '@id': ids.dataset },
    breadcrumb: { '@id': ids.breadcrumb },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: input.home.name, item: input.home.url },
      { '@type': 'ListItem', position: 2, name: input.statistics.name, item: input.statistics.url },
      { '@type': 'ListItem', position: 3, name: input.breadcrumbName, item: url },
    ],
  };

  const dataset = {
    '@type': 'Dataset',
    '@id': ids.dataset,
    url,
    name: input.dataset.name,
    description: input.dataset.description,
    inLanguage: input.language,
    keywords: input.dataset.keywords,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    temporalCoverage: input.dataset.temporalCoverage,
    spatialCoverage: { '@type': 'Place', name: input.dataset.placeName },
    about: { '@id': input.about['@id'] },
    creator: { '@id': organizationId },
    publisher: { '@id': organizationId },
    mainEntityOfPage: { '@id': ids.webPage },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    variableMeasured: input.dataset.variableMeasured.map(({ name, value, unitText }) => ({
      '@type': 'PropertyValue',
      name,
      value,
      ...(unitText && { unitText }),
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [webPage, breadcrumb, dataset],
  };
}

/** Keeps the measured variables that have a value, so the dataset never lists an empty one. */
export function presentVariables(
  variables: [name: string, value: number | null, unitText?: string][]
): PropertyValueInput[] {
  return variables.flatMap(([name, value, unitText]) =>
    value === null ? [] : [{ name, value, ...(unitText && { unitText }) }]
  );
}
