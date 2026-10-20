import { describe, expect, it } from 'vitest';
import { checkParams } from '@/app/(backend)/api/statistics/dtos/statistics.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';

describe('statistics checkParams', () => {
  it('returns the slug and locale', () => {
    expect(checkParams('2024', 'es')).toEqual({ publicSlug: '2024', locale: 'es' });
  });

  it('trims the slug', () => {
    expect(checkParams(' 2024 ', 'en')).toEqual({ publicSlug: '2024', locale: 'en' });
  });

  it.each(['en', 'es', 'eu'])('accepts the locale "%s"', (locale) => {
    expect(checkParams('2024', locale).locale).toBe(locale);
  });

  it('requires the slug', () => {
    expect(() => checkParams(null, 'es')).toThrow(
      new ValidationError("The 'publicSlug' parameter is required")
    );
  });

  it('rejects an invalid slug', () => {
    expect(() => checkParams('a/b', 'es')).toThrow(
      new ValidationError("The 'publicSlug' parameter is not a valid public slug")
    );
  });

  it.each([null, 'fr'])('rejects the locale %j', (locale) => {
    expect(() => checkParams('2024', locale)).toThrow(
      new ValidationError("The 'locale' parameter is required")
    );
  });

  it('reports the slug error first when both are invalid', () => {
    expect(() => checkParams('a/b', 'fr')).toThrow(
      new ValidationError("The 'publicSlug' parameter is not a valid public slug")
    );
  });
});
