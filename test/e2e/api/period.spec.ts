import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS, type PeriodItem } from '../support/api';

async function fetchPeriods(request: APIRequestContext): Promise<PeriodItem[]> {
  const response = await request.get('/api/period', { headers: API_HEADERS });

  expect(response.status()).toBe(200);

  return (await response.json()) as PeriodItem[];
}

test.describe('GET /api/period', () => {
  test('returns a non-empty array of periods', async ({ request }) => {
    const periods = await fetchPeriods(request);

    expect(Array.isArray(periods)).toBe(true);
    expect(periods.length).toBeGreaterThanOrEqual(1);
  });

  test('every item has the documented shape', async ({ request }) => {
    const periods = await fetchPeriods(request);

    for (const period of periods) {
      expect(typeof period.periodKey).toBe('string');
      expect(typeof period.publicSlug).toBe('string');
      expect(['year', 'global']).toContain(period.kind);
      expect(period.lastPublishedAt === null || typeof period.lastPublishedAt === 'string').toBe(
        true,
      );
    }
  });

  test('exactly one period is global', async ({ request }) => {
    const periods = await fetchPeriods(request);

    expect(periods.filter((period) => period.kind === 'global')).toHaveLength(1);
  });

  test('public slugs are unique', async ({ request }) => {
    const slugs = (await fetchPeriods(request)).map((period) => period.publicSlug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test('year slugs are four digits', async ({ request }) => {
    const years = (await fetchPeriods(request)).filter((period) => period.kind === 'year');

    for (const period of years) {
      expect(period.publicSlug).toMatch(/^\d{4}$/);
    }
  });

  test('year items are in descending order as returned', async ({ request }) => {
    const years = (await fetchPeriods(request))
      .filter((period) => period.kind === 'year')
      .map((period) => Number(period.publicSlug));

    for (let index = 1; index < years.length; index++) {
      expect(years[index]).toBeLessThanOrEqual(years[index - 1]);
    }
  });

  test('every slug is a valid public slug', async ({ request }) => {
    for (const period of await fetchPeriods(request)) {
      expect(period.publicSlug).toMatch(/^[\w-]{1,64}$/);
    }
  });
});
