import { describe, expect, it, vi } from 'vitest';
import { getStatistics } from '@/app/(frontend)/[locale]/services/getStatistics';
import { statisticsService } from '@/app/(backend)/api/statistics/services/statistics.service';
import {
  NotFoundError,
  PeriodMovedError,
  ServerError,
} from '@/app/(backend)/lib/errors';
import { makeStatisticsResponse } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/api/statistics/services/statistics.service', () => ({
  statisticsService: vi.fn(),
}));
vi.mock('next/cache', async () => (await import('@/test/helpers/nextCacheMock')).nextCacheModule());

describe('getStatistics', () => {
  it('calls the service with the parsed params and returns the response', async () => {
    const response = makeStatisticsResponse();
    vi.mocked(statisticsService).mockResolvedValue(response);

    const result = await getStatistics('2024', 'es');

    expect(result).toEqual(response);
    expect(statisticsService).toHaveBeenCalledWith({ publicSlug: '2024', locale: 'es' });
  });

  describe('invalid params', () => {
    it.each([
      ['an invalid slug', 'a/b', 'es'],
      ['an unsupported locale', '2024', 'fr'],
    ])('maps %s to a 404 without calling the service', async (_name, slug, locale) => {
      await expect(getStatistics(slug, locale as never)).rejects.toMatchObject({
        digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
      });
      expect(statisticsService).not.toHaveBeenCalled();
    });
  });

  describe('service errors', () => {
    it('maps NotFoundError to a 404', async () => {
      vi.mocked(statisticsService).mockRejectedValue(new NotFoundError('x'));

      await expect(getStatistics('2024', 'es')).rejects.toMatchObject({
        digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
      });
    });

    it.each([
      ['ServerError', new ServerError('boom')],
      ['a generic Error', new Error('boom')],
    ])('rethrows %s unchanged', async (_name, error) => {
      vi.mocked(statisticsService).mockRejectedValue(error);

      await expect(getStatistics('2024', 'es')).rejects.toBe(error);
    });
  });

  describe('moved period', () => {
    it.each([
      ['es', /^NEXT_REDIRECT;(replace|push);\/statistics\/2024;308/],
      ['en', /^NEXT_REDIRECT;(replace|push);\/en\/statistics\/2024;308/],
    ] as const)('permanently redirects for locale %s', async (locale, digest) => {
      vi.mocked(statisticsService).mockRejectedValue(new PeriodMovedError('2024'));

      const error = await getStatistics('2023', locale).catch((caught: unknown) => caught);

      expect((error as { digest: string }).digest).toMatch(digest);
    });
  });
});
