import { useStatisticsQuery } from '@/app/(frontend)/[locale]/hooks/query/useStatisticsQuery';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/[locale]/config/constants';
import { Statistics } from '../types/types';

export function useGlobal() {
  const { data: statistics, isLoading, isError } = useStatisticsQuery<Statistics>(GLOBAL_STATS_KEY);

  return {
    statistics,
    stats: statistics?.statistics,
    isLoading,
    isError,
    isUpdating: statistics?.isUpdating,
  };
}
