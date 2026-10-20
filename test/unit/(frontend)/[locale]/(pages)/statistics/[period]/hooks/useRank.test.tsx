import { act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_EXTRA_ROWS, RANK_PAGE_SIZE, useRank } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/hooks/useRank';
import type { CategoryDetailResponse } from '@/app/types/api/statistics.types';
import { fetchCategory } from '@/app/(frontend)/[locale]/services/fetchCategory';
import { makeCategoryDetail, makeRanksCategory, makeStatisticRank } from '@/test/fixtures/statistics';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderHookWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));

const ranksOf = (from: number, count = 10) => Array.from({ length: count }, (_, index) => makeStatisticRank(from + index));
const page = (from: number, nextCursor: string | null) =>
  ({ ...makeCategoryDetail('topNames', 'ranks', nextCursor), data: ranksOf(from) }) as unknown as CategoryDetailResponse;
const category = makeRanksCategory('topNames', ranksOf(1), 'cursor-1');

function setup(value = category) {
  return renderHookWithIntl(() => useRank(value), { queryClient: createTestQueryClient() });
}

describe('useRank', () => {
  beforeEach(() => {
    navigationState.params = { period: '2024' };
    vi.mocked(fetchCategory).mockReset();
  });

  it('exposes initial rows, paging constants, and scale', () => {
    const { result } = setup();
    expect(result.current.ranks).toHaveLength(10);
    expect(result.current).toMatchObject({ hasMore: true, canCollapse: false, isLoading: false, hasError: false, maxAbsValue: 999 });
    expect(typeof result.current.formatNumber.format).toBe('function');
    expect(RANK_PAGE_SIZE).toBe(10);
    expect(MAX_EXTRA_ROWS).toBe(40);
    expect(setup(makeRanksCategory('topNames', ranksOf(1), null)).result.current.hasMore).toBe(false);
  });

  it('loads, collapses, and re-expands a cached page without refetching', async () => {
    vi.mocked(fetchCategory).mockResolvedValue(page(11, 'cursor-2'));
    const { result } = setup();
    await act(() => result.current.loadMore());
    expect(fetchCategory).toHaveBeenCalledWith({
      period: '2024', category: 'topNames', cursor: 'cursor-1', limit: 10, signal: expect.any(AbortSignal),
    });
    expect(result.current.ranks).toHaveLength(20);
    expect(result.current.canCollapse).toBe(true);
    expect(result.current.hasMore).toBe(true);
    act(() => result.current.collapseRanks());
    expect(result.current.ranks).toHaveLength(10);
    expect(result.current.canCollapse).toBe(false);
    await act(() => result.current.loadMore());
    expect(result.current.ranks).toHaveLength(20);
    expect(fetchCategory).toHaveBeenCalledOnce();
  });

  it('loads pages sequentially up to the extra-row cap', async () => {
    vi.mocked(fetchCategory)
      .mockResolvedValueOnce(page(11, 'c2'))
      .mockResolvedValueOnce(page(21, 'c3'))
      .mockResolvedValueOnce(page(31, 'c4'))
      .mockResolvedValueOnce(page(41, 'c5'));
    const { result } = setup();
    for (let index = 0; index < 4; index += 1) {
      await act(() => result.current.loadMore());
    }
    expect(result.current.ranks).toHaveLength(50);
    expect(result.current.hasMore).toBe(false);
    await act(() => result.current.loadMore());
    expect(fetchCategory).toHaveBeenCalledTimes(4);
  });

  it('keeps rows on failure and clears the error after a successful retry', async () => {
    vi.mocked(fetchCategory)
      .mockImplementationOnce(() => new Promise((_, reject) => setTimeout(() => reject(new Error('x')), 0)))
      .mockResolvedValueOnce(page(11, null));
    const { result } = setup();
    await act(() => result.current.loadMore());
    expect(result.current.ranks).toHaveLength(10);
    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(result.current.isLoading).toBe(false);
    await act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.ranks).toHaveLength(20));
    expect(result.current.hasError).toBe(false);
  });

  it('reports loading while a page promise is pending', async () => {
    let resolve!: (value: CategoryDetailResponse) => void;
    vi.mocked(fetchCategory).mockReturnValue(new Promise((done) => { resolve = done; }));
    const { result } = setup();
    let pending!: Promise<void>;
    act(() => { pending = result.current.loadMore(); });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await act(async () => {
      resolve(page(11, null));
      await pending;
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('uses the global route period', async () => {
    navigationState.params = { period: 'global' };
    vi.mocked(fetchCategory).mockResolvedValue(page(11, null));
    const { result } = setup();
    await act(() => result.current.loadMore());
    expect(fetchCategory).toHaveBeenCalledWith(expect.objectContaining({ period: 'global' }));
  });
});
