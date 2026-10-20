import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS } from '../support/api';

type SchoolItem = { school: string; schoolKey: string };

async function getSchools(request: APIRequestContext, query = ''): Promise<SchoolItem[]> {
  const response = await request.get(`/api/schools${query}`, { headers: API_HEADERS });

  expect(response.status()).toBe(200);

  return (await response.json()) as SchoolItem[];
}

test.describe('GET /api/schools', () => {
  test('returns a non-empty list with unique school keys', async ({ request }) => {
    const schools = await getSchools(request);

    expect(schools.length).toBeGreaterThan(0);

    for (const item of schools) {
      expect(typeof item.school).toBe('string');
      expect(typeof item.schoolKey).toBe('string');
    }

    const keys = schools.map((item) => item.schoolKey);

    expect(new Set(keys).size).toBe(keys.length);
  });

  test('filters by a case-insensitive text', async ({ request }) => {
    const all = await getSchools(request);
    const text = all[0].school.slice(0, 3).toLowerCase().trim();
    const filtered = await getSchools(request, `?query=${encodeURIComponent(text)}`);

    expect(filtered.length).toBeGreaterThan(0);

    for (const item of filtered) {
      expect(item.school.toLowerCase()).toContain(text);
    }
  });

  test('returns an empty list when nothing matches', async ({ request }) => {
    expect(await getSchools(request, '?query=zzzzqqqq')).toEqual([]);
  });

  test('rejects a query longer than 100 characters', async ({ request }) => {
    const response = await request.get(`/api/schools?query=${'a'.repeat(101)}`, {
      headers: API_HEADERS,
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid request' });
  });

  test('treats a blank query like no query', async ({ request }) => {
    const all = await getSchools(request);
    const blank = await getSchools(request, '?query=%20%20');

    expect(blank).toHaveLength(all.length);
  });
});
