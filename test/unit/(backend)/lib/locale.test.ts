import { describe, expect, it } from 'vitest';
import { isLocale } from '@/app/(backend)/lib/locale';

describe('isLocale', () => {
  it.each(['es', 'en', 'eu'])('accepts the supported locale "%s"', (value) => {
    expect(isLocale(value)).toBe(true);
  });

  it.each(['fr', '', 'ES', 'es ', ' es', 'xx'])('rejects the value "%s"', (value) => {
    expect(isLocale(value)).toBe(false);
  });

  it('rejects null', () => {
    expect(isLocale(null)).toBe(false);
  });
});
