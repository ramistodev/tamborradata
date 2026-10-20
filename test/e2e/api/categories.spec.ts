import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS, discoverPeriods, pickGlobal, pickYear } from '../support/api';

type RankItem = {
  entityKey?: string;
  entityLabel?: string;
  school?: { schoolKey: string };
  groupSchool?: { schoolKey: string };
  rank: number;
};

type SeriesPoint = { metricKey?: string; dimensionKey?: string };

type Category = {
  category: string;
  dataShape: 'values' | 'ranks' | 'series';
  rendererKey: string;
  data: unknown[];
  pageInfo?: { nextCursor: string | null };
};

type Stats = { families: { categories: Category[] }[] };

type Ranking = { category: string; nextCursor: string; firstPage: RankItem[] };

const statsCache = new Map<string, Promise<Stats>>();

function loadStats(request: APIRequestContext, slug: string): Promise<Stats> {
  let cached = statsCache.get(slug);

  if (!cached) {
    cached = request
      .get(`/api/statistics?publicSlug=${slug}&locale=es`, { headers: API_HEADERS })
      .then(async (response) => {
        if (!response.ok()) throw new Error(`GET /api/statistics returned ${response.status()}`);
        return (await response.json()) as Stats;
      })
      .catch((error) => {
        statsCache.delete(slug);
        throw error;
      });
    statsCache.set(slug, cached);
  }

  return cached;
}

function allCategories(stats: Stats): Category[] {
  return stats.families.flatMap((family) => family.categories);
}

/** First ranks category whose preview has a second page. */
function findRanking(stats: Stats): Ranking | undefined {
  for (const category of allCategories(stats)) {
    const nextCursor = category.pageInfo?.nextCursor;

    if (category.dataShape === 'ranks' && typeof nextCursor === 'string') {
      return { category: category.category, nextCursor, firstPage: category.data as RankItem[] };
    }
  }

  return undefined;
}

/** Another ranks category, different from the excluded one. */
function findOtherRanking(stats: Stats, excludedName: string): string | undefined {
  return allCategories(stats).find(
    (category) => category.dataShape === 'ranks' && category.category !== excludedName,
  )?.category;
}

function itemIdentity(item: RankItem): string {
  return JSON.stringify([
    item.entityKey ?? null,
    item.entityLabel ?? null,
    item.school?.schoolKey ?? null,
    item.groupSchool?.schoolKey ?? null,
    item.rank,
  ]);
}

function categoryUrl(slug: string, category: string, query = ''): string {
  return `/api/statistics/${slug}/categories/${category}${query}`;
}

function tamper(cursor: string): string {
  const original = cursor[19];
  const replacement = original === 'A' ? 'B' : 'A';

  return `${cursor.slice(0, 19)}${replacement}${cursor.slice(20)}`;
}

async function loadRanking(request: APIRequestContext) {
  const year = pickYear(await discoverPeriods(request));

  if (!year) return { year, stats: undefined, ranking: undefined };

  const stats = await loadStats(request, year.publicSlug);

  return { year, stats, ranking: findRanking(stats) };
}

test.describe('GET /api/statistics/[period]/categories/[category] ranking pages', () => {
  test('returns the category detail with its page info', async ({ request }) => {
    const { year, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const response = await request.get(categoryUrl(year!.publicSlug, ranking!.category), {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as Category;

    expect(body.category).toBe(ranking!.category);
    expect(body.dataShape).toBe('ranks');
    expect(typeof body.rendererKey).toBe('string');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pageInfo).toBeDefined();
  });

  test('a cursor round trip continues after the first page without overlap', async ({
    request,
  }) => {
    const { year, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const response = await request.get(
      categoryUrl(year!.publicSlug, ranking!.category, `?cursor=${ranking!.nextCursor}&limit=10`),
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(200);

    const page = ((await response.json()) as Category).data as RankItem[];
    const firstIdentities = new Set(ranking!.firstPage.map(itemIdentity));

    expect(page.length).toBeGreaterThan(0);

    for (const item of page) {
      expect(firstIdentities.has(itemIdentity(item))).toBe(false);
    }

    const lastRankOfFirstPage = ranking!.firstPage[ranking!.firstPage.length - 1].rank;

    expect(page[0].rank).toBeGreaterThanOrEqual(lastRankOfFirstPage);
  });

  test('walking the pages terminates without repeating an item', async ({ request }) => {
    const { year, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const seen = new Set(ranking!.firstPage.map(itemIdentity));
    let cursor: string | null = ranking!.nextCursor;
    let requests = 0;

    while (cursor !== null) {
      requests += 1;
      expect(requests).toBeLessThanOrEqual(60);

      const response = await request.get(
        categoryUrl(year!.publicSlug, ranking!.category, `?limit=100&cursor=${cursor}`),
        { headers: API_HEADERS },
      );

      expect(response.status()).toBe(200);

      const body = (await response.json()) as Category;

      for (const item of body.data as RankItem[]) {
        const identity = itemIdentity(item);

        expect(seen.has(identity)).toBe(false);
        seen.add(identity);
      }

      cursor = body.pageInfo?.nextCursor ?? null;
    }
  });

  test('a tampered cursor answers 400', async ({ request }) => {
    const { year, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const response = await request.get(
      categoryUrl(year!.publicSlug, ranking!.category, `?cursor=${tamper(ranking!.nextCursor)}`),
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(400);
  });

  test('a cursor of another category answers 400', async ({ request }) => {
    const { year, stats, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const other = findOtherRanking(stats!, ranking!.category);
    test.skip(!other, 'no second ranking category in the live data');

    const response = await request.get(
      categoryUrl(year!.publicSlug, other!, `?cursor=${ranking!.nextCursor}`),
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(400);
  });

  for (const limit of ['0', 'abc']) {
    test(`limit=${limit} answers 400`, async ({ request }) => {
      const year = pickYear(await discoverPeriods(request));
      test.skip(!year, 'no published year period in the live data');

      const response = await request.get(
        categoryUrl(year!.publicSlug, 'totalParticipants', `?limit=${limit}`),
        { headers: API_HEADERS },
      );

      expect(response.status()).toBe(400);
    });
  }

  test('limit=1000 is clamped to at most 100 items', async ({ request }) => {
    const { year, ranking } = await loadRanking(request);
    test.skip(!ranking, 'no ranking with a second page in the live data');

    const response = await request.get(
      categoryUrl(year!.publicSlug, ranking!.category, '?limit=1000'),
      { headers: API_HEADERS },
    );

    expect(response.status()).toBe(200);
    expect(((await response.json()) as Category).data.length).toBeLessThanOrEqual(100);
  });
});

test.describe('GET /api/statistics/[period]/categories/[category] other cases', () => {
  test('an unknown category answers 400', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(categoryUrl(year!.publicSlug, 'notACategory'), {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
  });

  test('an unknown period answers 404', async ({ request }) => {
    const response = await request.get(categoryUrl('no-such-slug-xyz', 'totalParticipants'), {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(404);
  });

  test('a values category has no next page', async ({ request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    const response = await request.get(categoryUrl(year!.publicSlug, 'totalParticipants'), {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as Category;

    expect(body.dataShape).toBe('values');
    expect(body.pageInfo?.nextCursor).toBeNull();
  });

  test('a series category of the global period returns points with their keys', async ({
    request,
  }) => {
    const global = pickGlobal(await discoverPeriods(request));
    test.skip(!global, 'no published global period in the live data');

    const stats = await loadStats(request, global!.publicSlug);
    const series = allCategories(stats).filter((category) => category.dataShape === 'series');
    const preferred =
      series.find((category) => category.category === 'nameTrends') ??
      series.find((category) => category.category === 'schoolsEvolution') ??
      series[0];
    test.skip(!preferred, 'no series category in the global period of the live data');

    const response = await request.get(categoryUrl(global!.publicSlug, preferred!.category), {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as Category;
    const points = body.data as SeriesPoint[];

    expect(body.dataShape).toBe('series');
    expect(points.length).toBeGreaterThan(0);

    for (const point of points) {
      expect(typeof point.metricKey).toBe('string');
      expect(typeof point.dimensionKey).toBe('string');
    }
  });
});
