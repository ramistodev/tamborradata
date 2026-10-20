import { describe, expect, it } from 'vitest';
import {
  lineStats,
  tooltipEntries,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/stats';
import type { Dimension, Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';

function lineOf(key: string, values: [string, number][]): Line {
  return { key, label: key.toUpperCase(), color: 'var(--chart-1)', values: new Map(values) };
}

const dimensions: Dimension[] = [
  { key: '2022', order: 2022 },
  { key: '2023', order: 2023 },
  { key: '2024', order: 2024 },
];

describe('lineStats', () => {
  it('returns the latest value, the peak and the last change', () => {
    const line = lineOf('a', [['2022', 10], ['2023', 20], ['2024', 15]]);

    expect(lineStats(line, dimensions)).toEqual({
      latest: { index: 2, dimensionKey: '2024', value: 15 },
      peak: { index: 1, dimensionKey: '2023', value: 20 },
      change: -0.25,
    });
  });

  it('has no change with a single point', () => {
    const line = lineOf('a', [['2023', 10]]);

    expect(lineStats(line, dimensions)?.change).toBeNull();
  });

  it('has no change over a previous value of zero', () => {
    const line = lineOf('a', [['2023', 0], ['2024', 5]]);

    expect(lineStats(line, dimensions)?.change).toBeNull();
  });

  it('returns null for a line without values', () => {
    expect(lineStats(lineOf('a', []), dimensions)).toBeNull();
  });

  it('keeps the earliest peak on ties', () => {
    const line = lineOf('a', [['2022', 20], ['2023', 20], ['2024', 5]]);

    expect(lineStats(line, dimensions)?.peak).toEqual({ index: 0, dimensionKey: '2022', value: 20 });
  });

  it('skips a missing middle value', () => {
    const line = lineOf('a', [['2022', 10], ['2024', 30]]);

    expect(lineStats(line, dimensions)).toEqual({
      latest: { index: 2, dimensionKey: '2024', value: 30 },
      peak: { index: 2, dimensionKey: '2024', value: 30 },
      change: 2,
    });
  });
});

describe('tooltipEntries', () => {
  const lineA = lineOf('a', [['2023', 10], ['2024', 20]]);
  const lineB = lineOf('b', [['2024', 30]]);
  const twoYears = dimensions.slice(1);

  it('lists every line with a value, biggest first, with its change', () => {
    expect(tooltipEntries([lineA, lineB], twoYears, 1)).toEqual([
      { line: lineB, value: 30, change: null },
      { line: lineA, value: 20, change: 1 },
    ]);
  });

  it('leaves out lines without a value in that edition', () => {
    expect(tooltipEntries([lineA, lineB], twoYears, 0)).toEqual([
      { line: lineA, value: 10, change: null },
    ]);
  });

  it('measures the change against the previous value, skipping empty editions', () => {
    const gap = lineOf('a', [['2022', 10], ['2024', 20]]);

    expect(tooltipEntries([gap], dimensions, 2)).toEqual([{ line: gap, value: 20, change: 1 }]);
  });
});
