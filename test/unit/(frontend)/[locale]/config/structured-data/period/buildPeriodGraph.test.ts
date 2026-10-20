import { describe, expect, it } from 'vitest';

import {
  licenseUrl,
  ogImageUrl,
  organizationId,
  webSiteId,
} from '@/app/(frontend)/[locale]/config/constants';
import {
  buildPeriodGraph,
  presentVariables,
} from '@/app/(frontend)/[locale]/config/structured-data/period/buildPeriodGraph';

const url = 'https://tamborradata.com/statistics/2024';

function makeInput() {
  return {
    url,
    language: 'es-ES',
    title: 'T',
    description: 'D',
    publishedAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-02T10:00:00.000Z',
    home: { name: 'Inicio', url: 'https://tamborradata.com' },
    statistics: { name: 'Estadisticas', url: 'https://tamborradata.com/statistics/global' },
    breadcrumbName: 'B',
    about: { '@id': `${url}#event`, '@type': 'Event' },
    dataset: {
      name: 'N',
      description: 'DD',
      temporalCoverage: '2024',
      keywords: ['k1', 'k2'],
      variableMeasured: [
        { name: 'Participants', value: 1234, unitText: 'people' },
        { name: 'Count', value: 0 },
      ],
      placeName: 'Donostia',
    },
  };
}

describe('buildPeriodGraph', () => {
  it('declares the schema.org context and three connected nodes', () => {
    const graph = buildPeriodGraph(makeInput());

    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@graph']).toHaveLength(3);
    expect(graph['@graph'].map((node) => node['@type'])).toEqual([
      'WebPage',
      'BreadcrumbList',
      'Dataset',
    ]);
    expect(graph['@graph'].map((node) => node['@id'])).toEqual([
      `${url}#webpage`,
      `${url}#breadcrumb`,
      `${url}#dataset`,
    ]);
  });

  it('describes the web page node', () => {
    const input = makeInput();

    const [webPage] = buildPeriodGraph(input)['@graph'] as any[];

    expect(webPage).toMatchObject({
      url,
      name: 'T',
      description: 'D',
      inLanguage: 'es-ES',
      isPartOf: { '@id': webSiteId },
      publisher: { '@id': organizationId },
      mainEntity: { '@id': `${url}#dataset` },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl },
      datePublished: input.publishedAt,
      dateModified: input.updatedAt,
    });
    expect(webPage.about).toBe(input.about);
  });

  it('describes the breadcrumb node with three positioned items', () => {
    const [, breadcrumb] = buildPeriodGraph(makeInput())['@graph'] as any[];

    expect(breadcrumb.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://tamborradata.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Estadisticas',
        item: 'https://tamborradata.com/statistics/global',
      },
      { '@type': 'ListItem', position: 3, name: 'B', item: url },
    ]);
  });

  it('describes the dataset node', () => {
    const [, , dataset] = buildPeriodGraph(makeInput())['@graph'] as any[];

    expect(dataset).toMatchObject({
      license: licenseUrl,
      isAccessibleForFree: true,
      creator: { '@id': organizationId },
      publisher: { '@id': organizationId },
      about: { '@id': `${url}#event` },
      mainEntityOfPage: { '@id': `${url}#webpage` },
      spatialCoverage: { '@type': 'Place', name: 'Donostia' },
      keywords: ['k1', 'k2'],
      temporalCoverage: '2024',
    });
    expect(dataset.variableMeasured).toStrictEqual([
      { '@type': 'PropertyValue', name: 'Participants', value: 1234, unitText: 'people' },
      { '@type': 'PropertyValue', name: 'Count', value: 0 },
    ]);
  });

  it('survives a JSON round trip', () => {
    const graph = buildPeriodGraph(makeInput());

    expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);
  });
});

describe('presentVariables', () => {
  it('drops null values, keeps zeros and omits an empty unit', () => {
    const result = presentVariables([
      ['A', 1, 'x'],
      ['B', null],
      ['C', 0],
      ['D', 2, ''],
    ]);

    expect(result).toStrictEqual([
      { name: 'A', value: 1, unitText: 'x' },
      { name: 'C', value: 0 },
      { name: 'D', value: 2 },
    ]);
  });
});
