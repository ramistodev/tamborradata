import { describe, expect, it } from 'vitest';
import { periodKind } from '@/app/types/period.types';

describe('periodKind', () => {
  it('declares the period kinds', () => {
    expect(periodKind).toEqual({ year: 'year', global: 'global' });
  });
});
