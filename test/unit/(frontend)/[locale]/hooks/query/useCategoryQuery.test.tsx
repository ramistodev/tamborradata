import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCategoryQuery } from '@/app/(frontend)/[locale]/hooks/query/useCategoryQuery';
import { fetchCategory } from '@/app/(frontend)/[locale]/services/fetchCategory';
import { makeCategoryDetail } from '@/test/fixtures/statistics';
import { createQueryWrapper } from '@/test/helpers/queryClient';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));

describe('useCategoryQuery', () => {
  beforeEach(() => {
    vi.mocked(fetchCategory).mockReset();
  });

  it('loads initial and subsequent cursor pages', async () => {
    vi.mocked(fetchCategory)
      .mockResolvedValueOnce(makeCategoryDetail('topNames', 'ranks', 'c1'))
      .mockResolvedValueOnce(makeCategoryDetail('topNames', 'ranks', null));
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(
      () => useCategoryQuery('topNames', '2024', { initialCursor: 'c0', limit: 10 }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchCategory).toHaveBeenNthCalledWith(1, {
      period: '2024', category: 'topNames', cursor: 'c0', limit: 10, signal: expect.any(AbortSignal),
    });
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);
    await act(() => result.current.fetchNextPage());
    expect(fetchCategory).toHaveBeenNthCalledWith(2, {
      period: '2024', category: 'topNames', cursor: 'c1', limit: 10, signal: expect.any(AbortSignal),
    });
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('passes undefined cursor and limit when options are omitted', async () => {
    vi.mocked(fetchCategory).mockResolvedValue(makeCategoryDetail('topNames', 'ranks'));
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCategoryQuery('topNames', '2024'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchCategory).toHaveBeenCalledWith({
      period: '2024', category: 'topNames', cursor: undefined, limit: undefined, signal: expect.any(AbortSignal),
    });
  });

  it.each([
    ['disabled', 'topNames', '2024', { enabled: false }],
    ['empty category', '', '2024', undefined],
    ['empty period', 'topNames', '', undefined],
  ] as const)('stays idle when %s', (_name, category, period, options) => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(
      () => useCategoryQuery(category as 'topNames', period, options),
      { wrapper },
    );
    expect(fetchCategory).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('reports an error without retrying', async () => {
    const error = new Error('x');
    vi.mocked(fetchCategory).mockRejectedValue(error);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCategoryQuery('topNames', '2024'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect(fetchCategory).toHaveBeenCalledOnce();
  });
});
