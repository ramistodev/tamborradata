import { describe, expect, it } from 'vitest';
import { checkSummariesParams } from '@/app/(backend)/api/statistics/dtos/summaries.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';

describe('checkSummariesParams', () => {
  it('returns the slug and locale', () => {
    expect(checkSummariesParams('2024', 'en')).toEqual({ publicSlug: '2024', locale: 'en' });
  });

  it.each([null, 'fr'])('rejects the locale %j', (locale) => {
    expect(() => checkSummariesParams('2024', locale)).toThrow(
      new ValidationError("The 'locale' parameter must be one of: es, eu, en")
    );
  });

  it('requires the period', () => {
    expect(() => checkSummariesParams(null, 'es')).toThrow(
      new ValidationError("The 'period' parameter is required")
    );
  });

  it('rejects an invalid period', () => {
    expect(() => checkSummariesParams('a b', 'es')).toThrow(
      new ValidationError("The 'period' parameter is not a valid public slug")
    );
  });
});
