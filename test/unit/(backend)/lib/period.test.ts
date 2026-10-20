import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/app/(backend)/lib/errors';
import { parsePublicSlug } from '@/app/(backend)/lib/period';

const INVALID = new ValidationError("The 'publicSlug' parameter is not a valid public slug");
const REQUIRED = new ValidationError("The 'publicSlug' parameter is required");

describe('parsePublicSlug', () => {
  it.each(['2024', 'global', 'a-b_c', 'A1'])('returns the valid slug "%s" as is', (slug) => {
    expect(parsePublicSlug(slug)).toBe(slug);
  });

  it('trims surrounding whitespace', () => {
    expect(parsePublicSlug('  2024 ')).toBe('2024');
  });

  it('accepts a slug of exactly 64 characters', () => {
    const slug = 'a'.repeat(64);

    expect(parsePublicSlug(slug)).toBe(slug);
  });

  it('rejects a slug of 65 characters', () => {
    expect(() => parsePublicSlug('a'.repeat(65))).toThrow(INVALID);
  });

  it.each([null, ''])('requires the slug when it is %j', (value) => {
    expect(() => parsePublicSlug(value)).toThrow(REQUIRED);
  });

  it('rejects a whitespace-only slug after trimming it to empty', () => {
    expect(() => parsePublicSlug('   ')).toThrow(INVALID);
  });

  it.each(['a b', 'a/b', 'a.b', '../x', 'ñ'])('rejects the invalid slug "%s"', (slug) => {
    expect(() => parsePublicSlug(slug)).toThrow(INVALID);
  });

  describe('custom parameter name', () => {
    it('uses the name in the required error', () => {
      expect(() => parsePublicSlug(null, 'period')).toThrow(
        new ValidationError("The 'period' parameter is required")
      );
    });

    it('uses the name in the invalid error', () => {
      expect(() => parsePublicSlug('a/b', 'period')).toThrow(
        new ValidationError("The 'period' parameter is not a valid public slug")
      );
    });
  });
});
