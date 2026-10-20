import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/statistics/[period]/categories/[category]/route';
import { categoryDetailService } from '@/app/(backend)/api/statistics/services/categoryDetail.service';
import {
  NotFoundError,
  PeriodMovedError,
  ServerError,
  ValidationError,
} from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makeRequest, readJson, routeContext } from '@/test/helpers/route';
import { makeCategoryDetail } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/statistics/services/categoryDetail.service', () => ({
  categoryDetailService: vi.fn(),
}));

const PUBLIC = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60';
const base = '/api/statistics/2024/categories/topNames';
const ctx = () => routeContext({ period: '2024', category: 'topNames' });

describe('GET /api/statistics/[period]/categories/[category]', () => {
  describe('defaults', () => {
    it('uses the default limit, no cursor and the public cache header', async () => {
      const detail = makeCategoryDetail('topNames', 'ranks');
      vi.mocked(categoryDetailService).mockResolvedValue(detail);

      const response = await GET(makeRequest(base), ctx());

      expect(categoryDetailService).toHaveBeenCalledWith({
        publicSlug: '2024',
        category: 'topNames',
        limit: 25,
        cursor: undefined,
      });
      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(detail);
      expect(response.headers.get('cache-control')).toBe(PUBLIC);
    });
  });

  describe('pagination parameters', () => {
    it.each([
      ['limit', '?limit=10', { limit: 10, cursor: undefined }],
      ['cursor', '?cursor=abc', { limit: 25, cursor: 'abc' }],
      ['limit and cursor', '?limit=10&cursor=abc', { limit: 10, cursor: 'abc' }],
      ['an empty limit', '?limit=', { limit: 25, cursor: undefined }],
    ])('forwards %s and answers no-store', async (_name, query, expected) => {
      vi.mocked(categoryDetailService).mockResolvedValue(makeCategoryDetail('topNames', 'ranks'));

      const response = await GET(makeRequest(`${base}${query}`), ctx());

      expect(categoryDetailService).toHaveBeenCalledWith({
        publicSlug: '2024',
        category: 'topNames',
        ...expected,
      });
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe('no-store');
    });

    it('clamps a limit above the maximum to 100', async () => {
      vi.mocked(categoryDetailService).mockResolvedValue(makeCategoryDetail('topNames', 'ranks'));

      await GET(makeRequest(`${base}?limit=500`), ctx());

      expect(categoryDetailService).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });
  });

  describe('validation', () => {
    it.each([
      ['an unknown category', base, { period: '2024', category: 'nope' }],
      ['a zero limit', `${base}?limit=0`, { period: '2024', category: 'topNames' }],
      ['a non numeric limit', `${base}?limit=abc`, { period: '2024', category: 'topNames' }],
      ['an invalid period', base, { period: 'a b', category: 'topNames' }],
    ])('answers 400 with no-store for %s', async (_name, path, params) => {
      const response = await GET(makeRequest(path), routeContext(params));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(categoryDetailService).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('maps PeriodMovedError to 404', async () => {
      vi.mocked(categoryDetailService).mockRejectedValue(new PeriodMovedError('2024'));

      const response = await GET(makeRequest(base), ctx());

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: 'Not found' });
    });

    it('maps NotFoundError to 404', async () => {
      vi.mocked(categoryDetailService).mockRejectedValue(new NotFoundError('x'));

      const response = await GET(makeRequest(base), ctx());

      expect(response.status).toBe(404);
    });

    it('maps a ValidationError thrown by the service to 400', async () => {
      vi.mocked(categoryDetailService).mockRejectedValue(new ValidationError('bad cursor'));

      const response = await GET(makeRequest(`${base}?cursor=zzz`), ctx());

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
    });

    it('maps ServerError to 500', async () => {
      vi.mocked(categoryDetailService).mockRejectedValue(new ServerError('x'));

      const response = await GET(makeRequest(base), ctx());

      expect(response.status).toBe(500);
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(categoryDetailService).mockRejectedValue(new Error('boom'));

      const response = await GET(makeRequest(base), ctx());

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith(
        '[GET /api/statistics/[period]/categories/[category]] Unhandled error: boom',
        'error',
      );
    });
  });
});
