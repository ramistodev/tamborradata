import { describe, expect, it } from 'vitest';
import { niceTicks } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/niceTicks';

const table: { min: number; max: number; target: number; ticks: number[] }[] = [
  { min: 0, max: 100, target: 4, ticks: [0, 50, 100] },
  { min: 0, max: 10, target: 4, ticks: [0, 5, 10] },
  { min: 0, max: 7, target: 4, ticks: [0, 2, 4, 6, 8] },
  { min: 0, max: 1234, target: 4, ticks: [0, 500, 1000, 1500] },
  { min: -30, max: 0, target: 3, ticks: [-30, -20, -10, 0] },
  { min: -10, max: 20, target: 4, ticks: [-10, 0, 10, 20] },
  { min: 0, max: 0, target: 4, ticks: [0] },
];

describe('niceTicks', () => {
  it.each(table)('returns $ticks for ($min, $max, $target)', ({ min, max, target, ticks }) => {
    expect(niceTicks(min, max, target)).toEqual(ticks);
  });

  it.each(table)('covers the range and never yields -0 for ($min, $max, $target)', ({ min, max, target }) => {
    const ticks = niceTicks(min, max, target);

    expect(ticks.some((tick) => Object.is(tick, -0))).toBe(false);
    expect(ticks[0]).toBeLessThanOrEqual(min);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(max);
  });
});
