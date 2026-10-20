import { test, expect } from '@playwright/test';
import { API_HEADERS } from '../support/api';

test.describe('GET /api/ping', () => {
  test('answers 200 with an ok JSON body', async ({ request }) => {
    const response = await request.get('/api/ping', { headers: API_HEADERS });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(typeof body.message).toBe('string');
  });

  test('does not expose the x-powered-by header', async ({ request }) => {
    const response = await request.get('/api/ping', { headers: API_HEADERS });

    expect(response.headers()['x-powered-by']).toBeUndefined();
  });
});
