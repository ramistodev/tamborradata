import 'server-only';
import { log } from '@/app/(backend)/core/logger';
import { fetchStatistics } from '../repositories/statistics.repo';
import { groupBy } from '@/app/(backend)/shared/utils/groupBy';
import { StatisticsType } from '../types';

export async function getStatistics(year: string): Promise<StatisticsType> {
  const { statistics, error } = await fetchStatistics(year);

  if (error && !statistics) {
    log(`getStatistics error for year ${year}: ${error}`, 'error');
    return { statistics: null, error };
  }

  const statsByCategory = groupBy(statistics, 'category');

  return { statistics: statsByCategory, error: null };
}
