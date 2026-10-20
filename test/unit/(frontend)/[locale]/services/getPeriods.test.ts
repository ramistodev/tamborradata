import { describe, expect, it, vi } from 'vitest';
import { getPeriods } from '@/app/(frontend)/[locale]/services/getPeriods';
import { periodService } from '@/app/(backend)/api/period/service/period.service';
import { NotFoundError, ServerError, ValidationError } from '@/app/(backend)/lib/errors';
import { makeGlobalPeriod, makePeriod } from '@/test/fixtures/period';

vi.mock('@/app/(backend)/api/period/service/period.service', () => ({ periodService: vi.fn() }));
vi.mock('next/cache', async () => (await import('@/test/helpers/nextCacheMock')).nextCacheModule());

describe('getPeriods', () => {
  it('orders the periods by periodKey descending', async () => {
    vi.mocked(periodService).mockResolvedValue([
      makePeriod({ periodKey: '2023', publicSlug: '2023' }),
      makeGlobalPeriod(),
      makePeriod({ periodKey: '2025', publicSlug: '2025' }),
      makePeriod({ periodKey: '2024', publicSlug: '2024' }),
    ]);

    const result = await getPeriods();

    expect(result.map((period) => period.publicSlug)).toEqual(['global', '2025', '2024', '2023']);
  });

  it('returns an empty list when there are no periods', async () => {
    vi.mocked(periodService).mockResolvedValue([]);

    await expect(getPeriods()).resolves.toEqual([]);
  });

  it.each([
    ['NotFoundError', new NotFoundError('x')],
    ['ValidationError', new ValidationError('x')],
  ])('maps %s to a 404', async (_name, error) => {
    vi.mocked(periodService).mockRejectedValue(error);

    await expect(getPeriods()).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });
  });

  it.each([
    ['ServerError', new ServerError('boom')],
    ['a generic Error', new Error('boom')],
  ])('rethrows %s unchanged', async (_name, error) => {
    vi.mocked(periodService).mockRejectedValue(error);

    await expect(getPeriods()).rejects.toBe(error);
  });
});
