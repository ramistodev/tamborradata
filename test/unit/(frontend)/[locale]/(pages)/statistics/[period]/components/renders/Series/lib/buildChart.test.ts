import { describe, expect, it } from 'vitest';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import type { StatisticSeriesPoint } from '@/app/types/api/statistics.types';

function point(overrides: Partial<StatisticSeriesPoint>): StatisticSeriesPoint {
  return {
    entityType: 'name',
    metricKey: 'count',
    dimensionKey: '2023',
    dimensionOrder: 2023,
    value: 1,
    ...overrides,
  } as StatisticSeriesPoint;
}

const dataA: StatisticSeriesPoint[] = [
  point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2023', dimensionOrder: 2023, value: 5 }),
  point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2024', dimensionOrder: 2024, value: 10 }),
  point({ entityKey: 'b', entityLabel: 'Beñat', dimensionKey: '2023', dimensionOrder: 2023, value: 7 }),
];

describe('buildChart', () => {
  it('builds the sorted dimensions', () => {
    expect(buildChart(dataA, 'Fallback', 10).dimensions).toEqual([
      { key: '2023', order: 2023 },
      { key: '2024', order: 2024 },
    ]);
  });

  it('builds one line per entity, leading line first', () => {
    const { lines } = buildChart(dataA, 'Fallback', 10);

    expect(lines.map((line) => line.key)).toEqual(['a', 'b']);
    expect(lines[0].label).toBe('Ane');
    expect(lines[0].values).toEqual(
      new Map([
        ['2023', 5],
        ['2024', 10],
      ])
    );
  });

  it('assigns the theme colors in order', () => {
    const { lines } = buildChart(dataA, 'Fallback', 10);

    expect(lines[0].color).toBe('var(--chart-1)');
    expect(lines[1].color).toBe('var(--chart-2)');
  });

  it('keeps only the leading lines up to maxLines', () => {
    const { lines } = buildChart(dataA, 'Fallback', 1);

    expect(lines.map((line) => line.key)).toEqual(['a']);
  });

  it('names a line without entity after the fallback label', () => {
    const data = [
      point({ metricKey: 'growth', dimensionKey: '2023', dimensionOrder: 2023, value: 1 }),
      point({ metricKey: 'growth', dimensionKey: '2024', dimensionOrder: 2024, value: 2 }),
    ];

    const { lines } = buildChart(data, 'Fallback', 10);

    expect(lines).toHaveLength(1);
    expect(lines[0].key).toBe('growth');
    expect(lines[0].label).toBe('Fallback');
  });

  it('keys a school point by its school key', () => {
    const data = [
      point({ school: { schoolKey: 'sk', canonicalName: 'Escuela' }, value: 3 }),
    ];

    const { lines } = buildChart(data, 'Fallback', 10);

    expect(lines[0].key).toBe('sk');
    expect(lines[0].label).toBe('Escuela');
  });

  it('registers the dimension of a point without value but creates no line', () => {
    const data = [point({ entityKey: 'a', entityLabel: 'Ane', value: undefined })];

    const chart = buildChart(data, 'Fallback', 10);

    expect(chart.dimensions).toEqual([{ key: '2023', order: 2023 }]);
    expect(chart.lines).toEqual([]);
  });

  it('uses the first-seen index as order when the dimension has none', () => {
    const data = [
      point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: 'x', dimensionOrder: undefined }),
      point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: 'y', dimensionOrder: undefined }),
    ];

    expect(buildChart(data, 'Fallback', 10).dimensions).toEqual([
      { key: 'x', order: 0 },
      { key: 'y', order: 1 },
    ]);
  });

  it('sorts dimensions by order even when the input lists a later one first', () => {
    const data = [
      point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2024', dimensionOrder: 2024 }),
      point({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2023', dimensionOrder: 2023 }),
    ];

    expect(buildChart(data, 'Fallback', 10).dimensions.map((dimension) => dimension.key)).toEqual([
      '2023',
      '2024',
    ]);
  });

  it('cycles the colors when there are more lines than colors', () => {
    const data = Array.from({ length: 12 }, (_, index) =>
      point({ entityKey: `e${index}`, entityLabel: `E${index}`, value: 100 - index })
    );

    const { lines } = buildChart(data, 'Fallback', 12);

    expect(lines).toHaveLength(12);
    expect(lines[10].color).toBe('var(--chart-1)');
  });
});
