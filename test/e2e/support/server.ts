import type { APIRequestContext } from '@playwright/test';

/** True when the target is expected to be a production build: the webServer of the config (always production) or an external URL declared with E2E_PRODUCTION=1. */
export function isProductionTarget(): boolean {
  return !process.env.E2E_BASE_URL || process.env.E2E_PRODUCTION === '1';
}

/** Runtime probe: the production proxy answers 403 to `Accept: text/html` on /api/*. A dev server (guard disabled) answers 200. */
export async function isProductionServer(request: APIRequestContext): Promise<boolean> {
  const response = await request.get('/api/ping', { headers: { accept: 'text/html' } });
  return response.status() === 403;
}
