import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { checkParams } from '../../../(backend)/api/statistics/dtos/statistics.schema';
import { statisticsService } from '../../../(backend)/api/statistics/services/statistics.service';
import { StatisticsResponse } from '../../../types/api/statistics.types';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedStatistics = unstable_cache(statisticsService, ['statistics'], {
  revalidate: 3600,
  tags: ['statistics'],
});

// cache() dedupes calls within one request; unstable_cache persists across requests.
export const getStatistics = cache(
  async (periodKey: string, locale: string): Promise<StatisticsResponse> => {
    try {
      return await getCachedStatistics(checkParams(periodKey, locale));
    } catch (error) {
      return handleServiceError(error);
    }
  }
);
