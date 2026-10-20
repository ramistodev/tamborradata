import { test, expect } from '@playwright/test';
import { API_HEADERS, discoverPeriods } from '../support/api';

const SITE_URL = 'https://tamborradata.com';
const LOCALE_PREFIXES = ['', '/en', '/eu'] as const;

const SECURITY_HEADERS: Record<string, string> = {
  'x-dns-prefetch-control': 'on',
  'x-xss-protection': '1; mode=block',
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'origin-when-cross-origin',
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
};

test.describe('sitemap.xml', () => {
  test('is served as XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
    expect(body.startsWith('<?xml')).toBe(true);
    expect(body).toContain('<urlset');
  });

  test('lists every page in the three locales, including every published period', async ({
    request,
  }) => {
    const periods = await discoverPeriods(request);
    const body = await (await request.get('/sitemap.xml')).text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(locs).toContain(SITE_URL);
    expect(locs).toContain(`${SITE_URL}/en`);
    expect(locs).toContain(`${SITE_URL}/eu`);
    for (const prefix of LOCALE_PREFIXES) {
      expect(locs).toContain(`${SITE_URL}${prefix}/search-participants`);
      expect(locs).toContain(`${SITE_URL}${prefix}/privacy-policy`);
      for (const period of periods) {
        expect(locs).toContain(`${SITE_URL}${prefix}/statistics/${period.publicSlug}`);
      }
    }
    // Home, search, privacy policy and one page per period, each in three locales
    expect(locs).toHaveLength((3 + periods.length) * 3);
  });

  test('declares the hreflang alternates on every URL', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    const blocks = body.split('<url>').slice(1);

    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      for (const language of ['en', 'es', 'eu', 'x-default']) {
        expect(block).toMatch(new RegExp(`hreflang="${language}"`));
      }
    }
  });
});

test.describe('static SEO files', () => {
  test('robots.txt points to the sitemap and hides the API', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(body).toContain('Disallow: /api/');
  });

  test('site.webmanifest describes the installable app', async ({ request }) => {
    const response = await request.get('/site.webmanifest');
    const manifest = JSON.parse(await response.text()) as {
      name: string;
      start_url: string;
      display: string;
      icons: unknown[];
    };

    expect(response.status()).toBe(200);
    expect(manifest.name).toBe('Tamborradata');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toHaveLength(4);
  });
});

test.describe('security headers', () => {
  test('are sent on pages', async ({ request }) => {
    const response = await request.get('/', { headers: { accept: 'text/html' } });
    const headers = response.headers();

    expect(response.status()).toBe(200);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('are sent on API responses', async ({ request }) => {
    const response = await request.get('/api/ping', { headers: API_HEADERS });
    const headers = response.headers();

    expect(response.status()).toBe(200);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
    expect(headers['x-powered-by']).toBeUndefined();
  });
});
