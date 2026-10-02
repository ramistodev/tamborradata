import { useStatisticsQuery } from '@/app/(frontend)/hooks/query/useStatisticsQuery';
import { useParams } from 'next/navigation';
import { Statistics } from '../types/types';

export function useYears() {
  const { year }: { year: string } = useParams();
  const { data: statistics, isLoading, isError, error } = useStatisticsQuery<Statistics>(year);

  return {
    year,
    statistics,
    stats: statistics?.statistics,
    isLoading,
    isError,
    error,
    isUpdating: statistics?.isUpdating,
  };
}
