import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCategory } from '../../services/fetchCategory';
import { queryKeys } from '../../lib/queryKeys';
import { StatisticCategories } from '../../../../types/statistics';

type UseCategoryQueryOptions = {
  initialCursor?: string;
  limit?: number;
  enabled?: boolean;
};

/**
 * Pages of a category after the one rendered on the server. Each page carries the `nextCursor` for
 * the following one; `fetchNextPage()` loads it and `hasNextPage` is false once it is `null`.
 */
export function useCategoryQuery(
  category: StatisticCategories,
  period: string,
  { initialCursor, limit, enabled = true }: UseCategoryQueryOptions = {}
) {
  return useInfiniteQuery({
    queryKey: queryKeys.category(category, period, limit),
    queryFn: ({ pageParam }) => fetchCategory({ period, category, cursor: pageParam, limit }),
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
    enabled: enabled && Boolean(category) && Boolean(period),
    staleTime: Infinity, // Los datos no cambian, no es necesario refetching
    gcTime: Infinity, // nunca lo borra de la cache
    retry: 0, // no reintentar
    refetchOnWindowFocus: false,
  });
}
