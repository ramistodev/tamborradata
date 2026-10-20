import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/statistics/route';
import { statisticsService } from '@/app/(backend)/api/statistics/services/statistics.service';
import { NotFoundError, PeriodMovedError, ServerError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makeRequest, readJson } from '@/test/helpers/route';
import { makeStatisticsResponse } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/statistics/services/statistics.service', () => ({
  statisticsService: vi.fn(),
}));

const PUBLIC = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60';

describe('GET /api/statistics', () => {
  describe('success', () => {
    it('passes the params to the service and answers with the public cache header', async () => {
      const statistics = makeStatisticsResponse();
      vi.mocked(statisticsService).mockResolvedValue(statistics);

      const response = await GET(makeRequest('/api/statistics?publicSlug=2024&locale=es'));

      expect(statisticsService).toHaveBeenCalledWith({ publicSlug: '2024', locale: 'es' });
      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(statistics);
      expect(response.headers.get('cache-control')).toBe(PUBLIC);
    });

    it.each(['en', 'eu'])('accepts the %s locale', async (locale) => {
      vi.mocked(statisticsService).mockResolvedValue(makeStatisticsResponse());

      const response = await GET(makeRequest(`/api/statistics?publicSlug=2024&locale=${locale}`));

      expect(response.status).toBe(200);
      expect(statisticsService).toHaveBeenCalledWith({ publicSlug: '2024', locale });
    });
  });

  describe('validation', () => {
    it.each([
      ['a missing publicSlug', '/api/statistics?locale=es'],
      ['a missing locale', '/api/statistics?publicSlug=2024'],
      ['an unknown locale', '/api/statistics?publicSlug=2024&locale=fr'],
      ['an invalid publicSlug', '/api/statistics?publicSlug=a%2Fb&locale=es'],
    ])('answers 400 with no-store for %s', async (_name, path) => {
      const response = await GET(makeRequest(path));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(statisticsService).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    const path = '/api/statistics?publicSlug=2024&locale=es';

    it('maps PeriodMovedError to 404', async () => {
      vi.mocked(statisticsService).mockRejectedValue(new PeriodMovedError('2024'));

      const response = await GET(makeRequest(path));

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: 'Not found' });
    });

    it('maps NotFoundError to 404', async () => {
      vi.mocked(statisticsService).mockRejectedValue(new NotFoundError('x'));

      const response = await GET(makeRequest(path));

      expect(response.status).toBe(404);
    });

    it('maps ServerError to 500', async () => {
      vi.mocked(statisticsService).mockRejectedValue(new ServerError('x'));

      const response = await GET(makeRequest(path));

      expect(response.status).toBe(500);
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(statisticsService).mockRejectedValue(new Error('boom'));

      const response = await GET(makeRequest(path));

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith('[GET /api/statistics] Unhandled error: boom', 'error');
    });
  });
});
