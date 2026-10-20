import { describe, expect, it, vi } from 'vitest';
import { periodService } from '@/app/(backend)/api/period/service/period.service';
import { getAllPublishedPeriods } from '@/app/(backend)/api/period/repo/period.repo';
import { makeStatsPeriodRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/api/period/repo/period.repo', () => ({
  getAllPublishedPeriods: vi.fn(),
}));

describe('periodService', () => {
  it('maps the rows keeping order and null publication dates', async () => {
    vi.mocked(getAllPublishedPeriods).mockResolvedValue([
      makeStatsPeriodRow({ internal_key: 'global', public_slug: 'global', kind: 'global' }),
      makeStatsPeriodRow(),
      makeStatsPeriodRow({ internal_key: '2023', public_slug: '2023', last_published_at: null }),
    ]);

    const result = await periodService();

    expect(result).toStrictEqual([
      { periodKey: 'global', publicSlug: 'global', kind: 'global', lastPublishedAt: '2025-02-01T10:00:00.000Z' },
      { periodKey: '2024', publicSlug: '2024', kind: 'year', lastPublishedAt: '2025-02-01T10:00:00.000Z' },
      { periodKey: '2023', publicSlug: '2023', kind: 'year', lastPublishedAt: null },
    ]);
  });

  it('returns an empty list when there are no periods', async () => {
    vi.mocked(getAllPublishedPeriods).mockResolvedValue([]);

    await expect(periodService()).resolves.toEqual([]);
  });

  it('propagates a repo rejection unchanged', async () => {
    const error = new Error('db down');
    vi.mocked(getAllPublishedPeriods).mockRejectedValue(error);

    await expect(periodService()).rejects.toBe(error);
  });
});
