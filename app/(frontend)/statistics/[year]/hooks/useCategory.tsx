import { useCategoryQuery } from '@/app/(frontend)/hooks/query/useCategoryQuery';

export function useCategory<T>(category: string, year: string, enabled = true) {
  const {
    data: categoryData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useCategoryQuery<T>(category, year, enabled);

  return { categoryData, isLoading, isFetching, isError, refetch };
}
