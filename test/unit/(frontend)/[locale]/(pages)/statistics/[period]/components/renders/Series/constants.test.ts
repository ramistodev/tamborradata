import { describe, expect, it } from 'vitest';
import {
  COLORS,
  COMPACT_BREAKPOINT,
  COMPACT_MIN_WIDTH,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/constants';

describe('Series constants', () => {
  it('defines the compact breakpoint and minimum width', () => {
    expect(COMPACT_BREAKPOINT).toBe(560);
    expect(COMPACT_MIN_WIDTH).toBe(240);
  });

  it('defines ten theme colors', () => {
    expect(COLORS).toHaveLength(10);
    expect(COLORS[0]).toBe('var(--chart-1)');
    expect(COLORS[9]).toBe('var(--chart-10)');
  });
});
