import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS, discoverPeriods, pickGlobal, pickYear } from '../support/api';

type Category = {
  category: string;
  dataShape: 'values' | 'ranks' | 'series';
  rendererKey: string;
  data: unknown[];
  pageInfo?: { nextCursor: string | null };
};

type StatisticsBody = {
  metaData: { period: string; periodKind: string };
  overview: unknown[];
  intro: { section: string; summary: string };
  outro: { section: string; summary: string };
  families: {
    family: string;
    template: { section: string; summary: string };
    categories: Category[];
  }[];
};

type SummariesBody = {
  locale: string;
  metaData: { period: string; periodKind: string };
  summaries: { section: string; summary: string }[];
};

function getStatistics(request: APIRequestContext, slug: string, locale: string) {
  return request.get(`/api/statistics?publicSlug=${slug}&locale=${locale}`, {
    headers: API_HEADERS,
  });
}

test.describe('GET /api/statistics', () => {
  test('returns the full year payload in Spanish', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await getStatistics(request, year!.publicSlug, 'es');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as StatisticsBody;

    expect(body.metaData.period).toBe(year!.publicSlug);
    expect(body.metaData.periodKind).toBe('year');
    expect(Array.isArray(body.overview)).toBe(true);
    expect(Array.isArray(body.families)).toBe(true);
    expect(body.intro.section).toBe('periodIntro');
    expect(body.outro.section).toBe('periodOutro');
  });

  test('every family and category has the documented shape', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const body = (await (await getStatistics(request, year!.publicSlug, 'es')).json()) as StatisticsBody;

    expect(body.families.length).toBeGreaterThan(0);

    for (const family of body.families) {
      expect(typeof family.family).toBe('string');
      expect(family.template.section).toBe(family.family);

      for (const category of family.categories) {
        expect(typeof category.category).toBe('string');
        expect(['values', 'ranks', 'series']).toContain(category.dataShape);
        expect(typeof category.rendererKey).toBe('string');
        expect(Array.isArray(category.data)).toBe(true);

        if (category.dataShape === 'ranks') {
          const nextCursor = category.pageInfo?.nextCursor;

          expect(nextCursor === null || typeof nextCursor === 'string').toBe(true);
        }
      }
    }
  });

  for (const locale of ['en', 'eu']) {
    test(`answers 200 for locale ${locale} with the same period`, async ({ request }) => {
      const year = pickYear(await discoverPeriods(request));
      test.skip(!year, 'no published year period in the live data');

      const response = await getStatistics(request, year!.publicSlug, locale);

      expect(response.status()).toBe(200);
      expect(((await response.json()) as StatisticsBody).metaData.period).toBe(year!.publicSlug);
    });
  }

  test('the global slug returns a global period', async ({ request }) => {
    const global = pickGlobal(await discoverPeriods(request));
    test.skip(!global, 'no published global period in the live data');

    const response = await getStatistics(request, global!.publicSlug, 'es');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as StatisticsBody;

    expect(body.metaData.periodKind).toBe('global');
    expect(body.metaData.period).toBe(global!.publicSlug);
  });

  test('an unknown slug answers 404', async ({ request }) => {
    const response = await getStatistics(request, 'no-such-slug-xyz', 'es');

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });

  test('an invalid slug answers 400', async ({ request }) => {
    const response = await getStatistics(request, 'a%20b', 'es');

    expect(response.status()).toBe(400);
  });

  test('a missing locale answers 400', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics?publicSlug=${year!.publicSlug}`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
  });

  test('an unsupported locale answers 400', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await getStatistics(request, year!.publicSlug, 'fr');

    expect(response.status()).toBe(400);
  });
});

test.describe('GET /api/statistics/[period]/summaries', () => {
  test('returns the summaries of a year in Spanish', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics/${year!.publicSlug}/summaries?locale=es`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as SummariesBody;

    expect(body.locale).toBe('es');
    expect(body.metaData.period).toBe(year!.publicSlug);
    expect(Array.isArray(body.summaries)).toBe(true);

    for (const item of body.summaries) {
      expect(typeof item.section).toBe('string');
      expect(typeof item.summary).toBe('string');
    }
  });

  test('an unsupported locale answers 400', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics/${year!.publicSlug}/summaries?locale=fr`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
  });

  test('an unknown period answers 404', async ({ request }) => {
    const response = await request.get('/api/statistics/no-such-slug-xyz/summaries?locale=es', {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });
});
