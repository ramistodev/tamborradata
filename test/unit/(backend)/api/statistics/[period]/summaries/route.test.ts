import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/statistics/[period]/summaries/route';
import { summariesService } from '@/app/(backend)/api/statistics/services/summaries.service';
import { NotFoundError, PeriodMovedError, ServerError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makeRequest, readJson, routeContext } from '@/test/helpers/route';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/statistics/services/summaries.service', () => ({
  summariesService: vi.fn(),
}));

const PUBLIC = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60';
const path = '/api/statistics/2024/summaries?locale=en';
const ctx = () => routeContext({ period: '2024' });

describe('GET /api/statistics/[period]/summaries', () => {
  describe('success', () => {
    it('passes the params to the service, passes the body through and sets the public cache header', async () => {
      const summaries = { cards: [{ id: 'a' }] };
      vi.mocked(summariesService).mockResolvedValue(summaries as never);

      const response = await GET(makeRequest(path), ctx());

      expect(summariesService).toHaveBeenCalledWith({ publicSlug: '2024', locale: 'en' });
      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(summaries);
      expect(response.headers.get('cache-control')).toBe(PUBLIC);
    });
  });

  describe('validation', () => {
    it.each([
      ['a missing locale', '/api/statistics/2024/summaries', { period: '2024' }],
      ['an unknown locale', '/api/statistics/2024/summaries?locale=fr', { period: '2024' }],
      ['an invalid period', '/api/statistics/a%20b/summaries?locale=en', { period: 'a b' }],
    ])('answers 400 for %s', async (_name, requestPath, params) => {
      const response = await GET(makeRequest(requestPath), routeContext(params));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(summariesService).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('maps PeriodMovedError to 404', async () => {
      vi.mocked(summariesService).mockRejectedValue(new PeriodMovedError('2024'));

      const response = await GET(makeRequest(path), ctx());

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: 'Not found' });
    });

    it('maps NotFoundError to 404', async () => {
      vi.mocked(summariesService).mockRejectedValue(new NotFoundError('x'));

      const response = await GET(makeRequest(path), ctx());

      expect(response.status).toBe(404);
    });

    it('maps ServerError to 500', async () => {
      vi.mocked(summariesService).mockRejectedValue(new ServerError('x'));

      const response = await GET(makeRequest(path), ctx());

      expect(response.status).toBe(500);
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(summariesService).mockRejectedValue(new Error('boom'));

      const response = await GET(makeRequest(path), ctx());

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith(
        '[GET /api/statistics/[period]/summaries] Unhandled error: boom',
        'error',
      );
    });
  });
});
