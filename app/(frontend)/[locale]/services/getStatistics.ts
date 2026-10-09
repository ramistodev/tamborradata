import 'server-only';
import { cache } from 'react';
import { checkParams } from '../../../(backend)/api/statistics/dtos/statistics.schema';
import { statisticsService } from '../../../(backend)/api/statistics/services/statistics.service';
import { StatisticsResponse } from '../../../types/api/statistics.types';
import { Locale } from '../../../types/locale';
import { cacheAcrossRequests } from '../lib/cacheAcrossRequests';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedStatistics = cacheAcrossRequests(statisticsService, ['statistics'], {
  revalidate: 3600,
  tags: ['statistics'],
});

// cache() dedupes calls within one request; cacheAcrossRequests persists across requests (not in dev).
export const getStatistics = cache(
  async (periodKey: string, locale: Locale): Promise<StatisticsResponse> => {
    try {
      return await getCachedStatistics(checkParams(periodKey, locale));
    } catch (error) {
      return handleServiceError(error);
    }
  }
);
