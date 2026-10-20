import { describe, expect, it } from 'vitest';
import { checkCategoryDetailParams } from '@/app/(backend)/api/statistics/dtos/category.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';
import { statisticCategories } from '@/app/types/statistics';

const query = (overrides: Partial<Parameters<typeof checkCategoryDetailParams>[0]> = {}) => ({
  period: '2024',
  category: 'topNames',
  limit: null,
  cursor: null,
  ...overrides,
});

describe('checkCategoryDetailParams', () => {
  it('returns the defaults', () => {
    expect(checkCategoryDetailParams(query())).toEqual({
      publicSlug: '2024',
      category: 'topNames',
      limit: 25,
      cursor: undefined,
    });
  });

  describe('limit', () => {
    it.each([
      ['10', 10],
      ['100', 100],
      ['500', 100],
      ['', 25],
      ['1', 1],
    ])('turns "%s" into %i', (limit, expected) => {
      expect(checkCategoryDetailParams(query({ limit })).limit).toBe(expected);
    });

    it.each(['0', '-1', '1.5', 'abc'])('rejects "%s"', (limit) => {
      expect(() => checkCategoryDetailParams(query({ limit }))).toThrow(
        new ValidationError("The 'limit' parameter must be an integer >= 1")
      );
    });
  });

  describe('category', () => {
    it.each([null, 'nope', ''])('rejects %j', (category) => {
      expect(() => checkCategoryDetailParams(query({ category }))).toThrow(
        new ValidationError("The 'category' parameter must be a known statistic category")
      );
    });

    it('accepts every known category', () => {
      const rejected = Object.values(statisticCategories).filter((category) => {
        try {
          checkCategoryDetailParams(query({ category }));
          return false;
        } catch {
          return true;
        }
      });

      expect(rejected).toEqual([]);
    });
  });

  describe('period', () => {
    it('is required', () => {
      expect(() => checkCategoryDetailParams(query({ period: null }))).toThrow(
        new ValidationError("The 'period' parameter is required")
      );
    });

    it('must be a valid public slug', () => {
      expect(() => checkCategoryDetailParams(query({ period: 'a/b' }))).toThrow(
        new ValidationError("The 'period' parameter is not a valid public slug")
      );
    });
  });

  it('passes the cursor through untouched', () => {
    expect(checkCategoryDetailParams(query({ cursor: 'abc' })).cursor).toBe('abc');
  });
});
