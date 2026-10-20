import { test, expect } from '@playwright/test';
import { isProductionTarget } from '../support/server';

const SKIP_REASON =
  'requires a production build (set E2E_PRODUCTION=1 if E2E_BASE_URL points to one)';
const BROWSER_ACCEPT = 'text/html,application/xhtml+xml';

test.describe('API guard against browser navigation', () => {
  test('answers 403 Forbidden to an HTML accept on /api/ping', async ({ request }) => {
    test.skip(!isProductionTarget(), SKIP_REASON);

    const response = await request.get('/api/ping', { headers: { accept: BROWSER_ACCEPT } });

    expect(response.status()).toBe(403);
    expect(await response.text()).toBe('Forbidden');
  });

  test('lets a JSON accept through', async ({ request }) => {
    test.skip(!isProductionTarget(), SKIP_REASON);

    const response = await request.get('/api/ping', { headers: { accept: 'application/json' } });

    expect(response.status()).toBe(200);
  });

  test('lets a wildcard accept through', async ({ request }) => {
    test.skip(!isProductionTarget(), SKIP_REASON);

    const response = await request.get('/api/ping', { headers: { accept: '*/*' } });

    expect(response.status()).toBe(200);
  });

  for (const path of ['/api/period', '/api/overview', '/api/schools']) {
    test(`answers 403 to an HTML accept on ${path}`, async ({ request }) => {
      test.skip(!isProductionTarget(), SKIP_REASON);

      const response = await request.get(path, { headers: { accept: BROWSER_ACCEPT } });

      expect(response.status()).toBe(403);
    });
  }

  test('rejects a POST with an HTML accept before the route runs', async ({ request }) => {
    test.skip(!isProductionTarget(), SKIP_REASON);

    const response = await request.post('/api/participants', {
      headers: { accept: 'text/html' },
      data: { participant: 'x', schoolKey: '' },
    });

    expect(response.status()).toBe(403);
  });

  test('does not affect the pages', async ({ request }) => {
    test.skip(!isProductionTarget(), SKIP_REASON);

    const response = await request.get('/', { headers: { accept: 'text/html' } });

    expect(response.status()).toBe(200);
  });
});
