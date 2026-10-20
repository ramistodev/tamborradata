import { describe, expect, it } from 'vitest';
import {
  latestDate,
  PAGES_UPDATED,
  SITE_PUBLISHED,
} from '@/app/(frontend)/[locale]/config/contentDates';

describe('contentDates', () => {
  it.each([
    ['SITE_PUBLISHED', SITE_PUBLISHED],
    ['PAGES_UPDATED', PAGES_UPDATED],
  ])('%s is a valid ISO string', (_name, value) => {
    expect(new Date(value).toISOString()).toBe(value);
  });

  it('never dates the pages update before the site publication', () => {
    expect(Date.parse(PAGES_UPDATED)).toBeGreaterThanOrEqual(Date.parse(SITE_PUBLISHED));
  });

  // Documented use of the real clock: drift guard against a future-dated dateModified.
  it.each([
    ['SITE_PUBLISHED', SITE_PUBLISHED],
    ['PAGES_UPDATED', PAGES_UPDATED],
  ])('%s is not more than one day in the future', (_name, value) => {
    expect(Date.parse(value)).toBeLessThanOrEqual(Date.now() + 86_400_000);
  });

  describe('latestDate', () => {
    const older = '2025-01-01T00:00:00.000Z';
    const newer = '2026-01-01T00:00:00.000Z';

    it('returns the latest date regardless of the argument order', () => {
      expect(latestDate(older, newer)).toBe(newer);
      expect(latestDate(newer, older)).toBe(newer);
    });

    it('ignores null and undefined values', () => {
      expect(latestDate(null, undefined, older)).toBe(older);
    });

    it('returns undefined when there is no usable date', () => {
      expect(latestDate(null, undefined)).toBeUndefined();
      expect(latestDate()).toBeUndefined();
    });
  });
});
