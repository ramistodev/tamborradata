import { useStatisticsQuery } from '@/app/(frontend)/hooks/query/useStatisticsQuery';
import { useParams } from 'next/navigation';
import { Statistics } from '../types/types';

export function useYears() {
  const { year }: { year: string } = useParams();
  const {
    data: statistics,
    isLoading,
    isFetching,
    isFetched,
  } = useStatisticsQuery<Statistics>(year);

  return { statistics, stats: statistics?.statistics, isLoading, isFetching, isFetched, year };
}
