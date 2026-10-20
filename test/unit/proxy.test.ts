import { beforeEach, describe, expect, it, vi } from 'vitest';

import { config, proxy } from '@/proxy';
import { makeRequest } from '@/test/helpers/route';

const handleI18nSpy = vi.hoisted(() => vi.fn());

vi.mock('next-intl/middleware', () => ({ default: () => handleI18nSpy }));

const sentinel = new Response('i18n');

describe('proxy', () => {
  beforeEach(() => {
    handleI18nSpy.mockReturnValue(sentinel);
  });

  describe('API guard', () => {
    it.each(['production', 'test'])('blocks browser navigation to /api when NODE_ENV is %s', async (env) => {
      vi.stubEnv('NODE_ENV', env);

      const response = proxy(
        makeRequest('/api/ping', { headers: { accept: 'text/html,application/xhtml+xml' } }),
      );

      expect(response.status).toBe(403);
      expect(await response.text()).toBe('Forbidden');
      expect(handleI18nSpy).not.toHaveBeenCalled();
    });

    it.each([
      ['a JSON accept header', { accept: 'application/json' }],
      ['no accept header', {}],
      ['a wildcard accept header', { accept: '*/*' }],
    ])('lets the request through with %s', (_name, headers) => {
      vi.stubEnv('NODE_ENV', 'production');

      const response = proxy(makeRequest('/api/ping', { headers }));

      expect(response.status).toBe(200);
      expect(response.headers.get('x-middleware-next')).toBe('1');
      expect(handleI18nSpy).not.toHaveBeenCalled();
    });

    it('lets text/html requests through in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const response = proxy(makeRequest('/api/ping', { headers: { accept: 'text/html' } }));

      expect(response.headers.get('x-middleware-next')).toBe('1');
    });

    // Characterization: the check is a plain startsWith('/api'), so look-alike paths are guarded too.
    it.each(['/apis', '/api'])('treats %s as an API path', (path) => {
      vi.stubEnv('NODE_ENV', 'production');

      const response = proxy(makeRequest(path, { headers: { accept: 'text/html' } }));

      expect(response.status).toBe(403);
    });
  });

  describe('i18n routing', () => {
    it.each(['/', '/en/statistics', '/search-participants'])(
      'delegates %s to the i18n middleware',
      (path) => {
        const request = makeRequest(path);

        const response = proxy(request);

        expect(handleI18nSpy).toHaveBeenCalledWith(request);
        expect(response).toBe(sentinel);
      },
    );
  });

  describe('config', () => {
    it('declares the expected matchers', () => {
      expect(config.matcher).toEqual(['/((?!_next|_vercel|.*\\..*).*)', '/api/:path*']);
    });

    describe('page matcher semantics', () => {
      const pageMatcher = new RegExp(`^${config.matcher[0]}$`);

      it.each(['/', '/en/statistics', '/search-participants'])('matches %s', (path) => {
        expect(pageMatcher.test(path)).toBe(true);
      });

      it.each([
        '/robots.txt',
        '/sitemap.xml',
        '/site.webmanifest',
        '/_next/static/chunk.js',
        '/_vercel/insights/script.js',
        '/favicon.ico',
      ])('does not match %s', (path) => {
        expect(pageMatcher.test(path)).toBe(false);
      });
    });
  });
});
