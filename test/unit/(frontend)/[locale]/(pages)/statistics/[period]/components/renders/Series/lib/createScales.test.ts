import { describe, expect, it } from 'vitest';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import { createScales } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/createScales';
import type { Dimension, Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';

const layout = chartLayout(1000);

function line(values: [string, number][]): Line {
  return { key: 'l', label: 'L', color: 'var(--chart-1)', values: new Map(values) };
}

describe('createScales', () => {
  const dimensions: Dimension[] = [
    { key: 'a', order: 0 },
    { key: 'b', order: 10 },
  ];

  it('maps editions and values to viewBox coordinates', () => {
    const scales = createScales(dimensions, [line([['a', 0], ['b', 100]])], layout);

    expect(scales.ticks).toEqual([0, 50, 100]);
    expect(scales.positions).toEqual([46, 616]);
    expect(scales.y(0)).toBe(250);
    expect(scales.y(50)).toBe(139);
    expect(scales.y(100)).toBe(28);
    expect(scales.baseY).toBe(250);
    expect(scales.labelStep).toBe(1);
  });

  it('keeps the zero line when values are negative', () => {
    const scales = createScales(dimensions, [line([['a', -10], ['b', 20]])], layout);

    expect(scales.ticks).toEqual([-10, 0, 10, 20]);
    expect(scales.baseY).toBeCloseTo(176, 5);
    expect(scales.y(-10)).toBeCloseTo(250, 5);
    expect(scales.y(20)).toBeCloseTo(28, 5);
  });

  it('places a single dimension at the left padding', () => {
    const scales = createScales([{ key: 'a', order: 2024 }], [line([['a', 5]])], layout);

    expect(scales.positions).toEqual([46]);
  });

  it('returns only the zero tick when there are no lines', () => {
    expect(createScales(dimensions, [], layout).ticks).toEqual([0]);
  });

  it('shows one label out of two when editions are close together', () => {
    const many: Dimension[] = Array.from({ length: 21 }, (_, index) => ({
      key: String(index),
      order: index,
    }));

    expect(createScales(many, [], layout).labelStep).toBe(2);
  });
});
