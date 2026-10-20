import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_HEADERS, discoverPeriods, pickGlobal, pickYear } from '../support/api';

type TopEntry = { label: string; count: number };

type GlobalPeriod = {
  publicSlug: string;
  startYear: number;
  endYear: number;
  totalParticipations: number;
  totalSchools: number;
  editionsCount: number;
  missingYears: number[];
  lastPublishedAt: string;
  topName: TopEntry;
  topSurname: TopEntry;
  topSchool: TopEntry;
};

type LastPeriod = {
  publicSlug: string;
  year: number;
  totalParticipations: number;
  totalSchools: number;
  growthRate: number | null;
  lastPublishedAt: string;
  topName: TopEntry;
  topSurname: TopEntry;
  topSchool: TopEntry;
};

type Overview = { globalPeriod?: GlobalPeriod; lastPeriod?: LastPeriod };

async function getOverview(request: APIRequestContext, query = ''): Promise<Overview> {
  const response = await request.get(`/api/overview${query}`, { headers: API_HEADERS });

  expect(response.status()).toBe(200);

  return (await response.json()) as Overview;
}

function expectTopEntry(entry: TopEntry) {
  expect(typeof entry.label).toBe('string');
  expect(entry.label.length).toBeGreaterThan(0);
  expect(typeof entry.count).toBe('number');
}

test.describe('GET /api/overview scopes', () => {
  test('scope=global returns only the global period', async ({ request }) => {
    const body = await getOverview(request, '?scope=global');

    expect(body.globalPeriod).toBeDefined();
    expect(body.lastPeriod).toBeUndefined();
    expect('lastPeriod' in body).toBe(false);
  });

  test('scope=last returns only the last period', async ({ request }) => {
    const body = await getOverview(request, '?scope=last');

    expect(body.lastPeriod).toBeDefined();
    expect(body.globalPeriod).toBeUndefined();
    expect('globalPeriod' in body).toBe(false);
  });

  test('scope=both returns both periods', async ({ request }) => {
    const body = await getOverview(request, '?scope=both');

    expect(body.globalPeriod).toBeDefined();
    expect(body.lastPeriod).toBeDefined();
  });

  test('no scope behaves like both', async ({ request }) => {
    const body = await getOverview(request);

    expect(body.globalPeriod).toBeDefined();
    expect(body.lastPeriod).toBeDefined();
  });

  test('an unknown scope is rejected with 400 and no-store', async ({ request }) => {
    const response = await request.get('/api/overview?scope=nope', { headers: API_HEADERS });

    expect(response.status()).toBe(400);
    expect(response.headers()['cache-control']).toBe('no-store');
    expect(await response.json()).toEqual({ error: 'Invalid request' });
  });
});

test.describe('GET /api/overview global period', () => {
  test('has the documented shape', async ({ request }) => {
    const { globalPeriod } = await getOverview(request, '?scope=global');

    expect(globalPeriod).toBeDefined();

    const global = globalPeriod as GlobalPeriod;

    expect(typeof global.publicSlug).toBe('string');
    expect(typeof global.startYear).toBe('number');
    expect(typeof global.endYear).toBe('number');
    expect(typeof global.totalParticipations).toBe('number');
    expect(global.totalParticipations).toBeGreaterThan(0);
    expect(typeof global.totalSchools).toBe('number');
    expect(global.totalSchools).toBeGreaterThan(0);
    expect(typeof global.editionsCount).toBe('number');
    expect(Array.isArray(global.missingYears)).toBe(true);
    expect(global.missingYears.every((year) => typeof year === 'number')).toBe(true);
    expect(typeof global.lastPublishedAt).toBe('string');
    expectTopEntry(global.topName);
    expectTopEntry(global.topSurname);
    expectTopEntry(global.topSchool);
  });

  test('editionsCount matches the year range minus the missing years', async ({ request }) => {
    const global = (await getOverview(request, '?scope=global')).globalPeriod as GlobalPeriod;

    expect(global.editionsCount).toBe(global.endYear - global.startYear + 1 - global.missingYears.length);
  });

  test('every missing year lies inside the year range', async ({ request }) => {
    const global = (await getOverview(request, '?scope=global')).globalPeriod as GlobalPeriod;

    for (const year of global.missingYears) {
      expect(year).toBeGreaterThanOrEqual(global.startYear);
      expect(year).toBeLessThanOrEqual(global.endYear);
    }
  });

  test('its slug is the global slug listed by /api/period', async ({ request }) => {
    const global = pickGlobal(await discoverPeriods(request));
    const body = await getOverview(request, '?scope=global');

    expect(global).toBeDefined();
    expect(body.globalPeriod?.publicSlug).toBe(global?.publicSlug);
  });
});

test.describe('GET /api/overview last period', () => {
  test('has the documented shape', async ({ request }) => {
    const last = (await getOverview(request, '?scope=last')).lastPeriod as LastPeriod;

    expect(typeof last.publicSlug).toBe('string');
    expect(typeof last.year).toBe('number');
    expect(typeof last.totalParticipations).toBe('number');
    expect(typeof last.totalSchools).toBe('number');
    expect(last.growthRate === null || typeof last.growthRate === 'number').toBe(true);
    expect(typeof last.lastPublishedAt).toBe('string');
    expectTopEntry(last.topName);
    expectTopEntry(last.topSurname);
    expectTopEntry(last.topSchool);
  });

  test('its slug is the newest year listed by /api/period', async ({ request }) => {
    const newest = pickYear(await discoverPeriods(request));
    const last = (await getOverview(request, '?scope=last')).lastPeriod as LastPeriod;

    expect(newest).toBeDefined();
    expect(last.publicSlug).toBe(newest?.publicSlug);
    expect(String(last.year)).toBe(newest?.publicSlug);
  });
});
