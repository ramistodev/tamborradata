import { describe, expect, it } from 'vitest';
import {
  areaPath,
  monotonePath,
  segmentsOf,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/paths';
import type { Dimension, Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';

describe('monotonePath', () => {
  it.each([
    { name: 'no points', points: [], expected: '' },
    { name: 'a single point', points: [{ x: 1, y: 2 }], expected: 'M1 2' },
    {
      name: 'two points',
      points: [{ x: 0, y: 0 }, { x: 30, y: 30 }],
      expected: 'M0 0 C10 10 20 20 30 30',
    },
    {
      name: 'a flat line',
      points: [{ x: 0, y: 5 }, { x: 30, y: 5 }],
      expected: 'M0 5 C10 5 20 5 30 5',
    },
    {
      name: 'a peak',
      points: [{ x: 0, y: 0 }, { x: 30, y: 30 }, { x: 60, y: 0 }],
      expected: 'M0 0 C10 10 20 30 30 30 C40 30 50 10 60 0',
    },
  ])('draws $name', ({ points, expected }) => {
    expect(monotonePath(points)).toBe(expected);
  });

  it('starts every non empty path with a move command', () => {
    expect(monotonePath([{ x: 0, y: 0 }, { x: 5, y: 9 }])).toMatch(/^M/);
  });
});

describe('areaPath', () => {
  it('closes the curve down to the baseline', () => {
    expect(areaPath([{ x: 0, y: 0 }, { x: 30, y: 30 }], 100)).toBe(
      'M0 0 C10 10 20 20 30 30 L30 100 L0 100 Z'
    );
  });
});

describe('segmentsOf', () => {
  const dimensions: Dimension[] = [
    { key: 'a', order: 0 },
    { key: 'b', order: 1 },
    { key: 'c', order: 2 },
  ];
  const scales = { positions: [0, 10, 20], y: (value: number) => value * 10 };

  function lineOf(values: [string, number][]): Line {
    return { key: 'l', label: 'L', color: 'var(--chart-1)', values: new Map(values) };
  }

  it('splits the line where an edition has no value', () => {
    const line = lineOf([['a', 1], ['c', 3]]);

    expect(segmentsOf(line, dimensions, scales)).toEqual([[{ x: 0, y: 10 }], [{ x: 20, y: 30 }]]);
  });

  it('keeps consecutive editions in one segment', () => {
    const line = lineOf([['a', 1], ['b', 2], ['c', 3]]);

    const segments = segmentsOf(line, dimensions, scales);

    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual([{ x: 0, y: 10 }, { x: 10, y: 20 }, { x: 20, y: 30 }]);
  });

  it('returns no segments for a line without values', () => {
    expect(segmentsOf(lineOf([]), dimensions, scales)).toEqual([]);
  });
});
