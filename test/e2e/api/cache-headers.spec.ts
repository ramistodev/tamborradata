import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS, discoverPeriods, pickYear } from '../support/api';

const PUBLIC = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60';

type Category = {
  category: string;
  dataShape: 'values' | 'ranks' | 'series';
  pageInfo?: { nextCursor: string | null };
};

type Stats = { families: { categories: Category[] }[] };

async function findRankingWithSecondPage(
  request: APIRequestContext,
  slug: string,
): Promise<{ category: string; nextCursor: string } | undefined> {
  const response = await request.get(`/api/statistics?publicSlug=${slug}&locale=es`, {
    headers: API_HEADERS,
  });

  expect(response.status()).toBe(200);

  const stats = (await response.json()) as Stats;

  for (const family of stats.families) {
    for (const category of family.categories) {
      const nextCursor = category.pageInfo?.nextCursor;

      if (category.dataShape === 'ranks' && typeof nextCursor === 'string') {
        return { category: category.category, nextCursor };
      }
    }
  }

  return undefined;
}

test.describe('public cache headers', () => {
  test('the statistics endpoint is cacheable at the edge', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics?publicSlug=${year!.publicSlug}&locale=es`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe(PUBLIC);
  });

  test('the summaries endpoint is cacheable at the edge', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics/${year!.publicSlug}/summaries?locale=es`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe(PUBLIC);
  });

  test('a category without query is cacheable at the edge', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(
      `/api/statistics/${year!.publicSlug}/categories/totalParticipants`,
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe(PUBLIC);
  });

  test('a category with a limit is not stored', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(
      `/api/statistics/${year!.publicSlug}/categories/totalParticipants?limit=10`,
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('no-store');
  });

  test('a category with a cursor is not stored', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const ranking = await findRankingWithSecondPage(request, year!.publicSlug);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const response = await request.get(
      `/api/statistics/${year!.publicSlug}/categories/${ranking!.category}?cursor=${ranking!.nextCursor}`,
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('no-store');
  });
});

test.describe('error responses are never cached', () => {
  test('a 404 for an unknown slug is no-store', async ({ request }) => {
    const response = await request.get('/api/statistics?publicSlug=no-such-slug-xyz&locale=es', {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(404);
    expect(response.headers()['cache-control']).toBe('no-store');
  });

  test('a 400 for an invalid locale is no-store', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics?publicSlug=${year!.publicSlug}&locale=fr`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
    expect(response.headers()['cache-control']).toBe('no-store');
  });

  test('a 400 for an invalid category is no-store', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(`/api/statistics/${year!.publicSlug}/categories/notACategory`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
    expect(response.headers()['cache-control']).toBe('no-store');
  });
});

test.describe('endpoints without the public policy', () => {
  for (const path of ['/api/period', '/api/ping']) {
    test(`${path} does not set the public cache policy`, async ({ request }) => {
      const response = await request.get(path, { headers: API_HEADERS });

      expect(response.status()).toBe(200);
      expect(response.headers()['cache-control']).not.toBe(PUBLIC);
    });
  }
});
