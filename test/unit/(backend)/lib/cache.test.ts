import { describe, expect, it } from 'vitest';
import { cacheControlFor } from '@/app/(backend)/lib/cache';

const PUBLIC = { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60' };
const NO_STORE = { 'Cache-Control': 'no-store' };

describe('cacheControlFor', () => {
  it('uses the public policy for previews', () => {
    expect(cacheControlFor.preview()).toEqual(PUBLIC);
  });

  it('uses the public policy for summaries', () => {
    expect(cacheControlFor.summaries()).toEqual(PUBLIC);
  });

  describe('category', () => {
    it('uses the public policy without cursor and limit', () => {
      expect(cacheControlFor.category({ hasCursor: false, hasLimit: false })).toEqual(PUBLIC);
    });

    it.each([
      { hasCursor: true, hasLimit: false },
      { hasCursor: false, hasLimit: true },
      { hasCursor: true, hasLimit: true },
    ])('uses no-store for $hasCursor / $hasLimit', (flags) => {
      expect(cacheControlFor.category(flags)).toEqual(NO_STORE);
    });
  });
});
