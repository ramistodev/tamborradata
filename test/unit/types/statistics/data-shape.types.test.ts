import { describe, expect, it } from 'vitest';
import {
  categoryDataShape,
  categoryRendererKey,
  statisticRendererDataShape,
} from '@/app/types/statistics';

describe('data shape types', () => {
  it('declares the three data shapes', () => {
    expect(categoryDataShape).toEqual({ values: 'values', ranks: 'ranks', series: 'series' });
  });

  it('maps every renderer key to a data shape and nothing else', () => {
    expect(Object.keys(statisticRendererDataShape).sort()).toEqual(
      Object.values(categoryRendererKey).sort()
    );
  });

  it('maps renderer keys only to known data shapes', () => {
    const known = new Set<string>(Object.values(categoryDataShape));
    const offenders = Object.entries(statisticRendererDataShape).filter(
      ([, shape]) => !known.has(shape)
    );

    expect(offenders).toEqual([]);
  });

  it.each([
    ['metricCard', 'values'],
    ['horizontalRanking', 'ranks'],
    ['dataTable', 'ranks'],
    ['lineChart', 'series'],
    ['scatterPlot', 'series'],
  ] as const)('maps %s to %s', (rendererKey, shape) => {
    expect(statisticRendererDataShape[rendererKey]).toBe(shape);
  });
});
