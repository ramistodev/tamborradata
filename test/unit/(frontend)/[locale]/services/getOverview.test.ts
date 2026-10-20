import { describe, expect, it, vi } from 'vitest';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { overviewService } from '@/app/(backend)/api/overview/service/overview.service';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('@/app/(backend)/api/overview/service/overview.service', () => ({
  overviewService: vi.fn(),
}));
vi.mock('next/cache', async () => (await import('@/test/helpers/nextCacheMock')).nextCacheModule());

describe('getOverview', () => {
  it('returns the service value for the requested scope', async () => {
    const overview = makeOverviewResponse();
    vi.mocked(overviewService).mockResolvedValue(overview);

    const result = await getOverview('both');

    expect(result).toEqual(overview);
    expect(overviewService).toHaveBeenCalledWith('both');
  });

  it.each([
    ['NotFoundError', new NotFoundError('x')],
    ['ServerError', new ServerError('boom')],
    ['a generic Error', new Error('boom')],
  ])('returns null for %s when nullable', async (_name, error) => {
    vi.mocked(overviewService).mockRejectedValue(error);

    await expect(getOverview('both', true)).resolves.toBeNull();
  });

  it('maps NotFoundError to a 404 when not nullable', async () => {
    vi.mocked(overviewService).mockRejectedValue(new NotFoundError('x'));

    await expect(getOverview('both')).rejects.toMatchObject({
      digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
    });
  });

  it('rethrows ServerError unchanged when not nullable', async () => {
    const error = new ServerError('boom');
    vi.mocked(overviewService).mockRejectedValue(error);

    await expect(getOverview('both')).rejects.toBe(error);
  });
});
