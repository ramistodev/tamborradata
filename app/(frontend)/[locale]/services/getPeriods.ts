import 'server-only';
import { cache } from 'react';
import { periodService } from '../../../(backend)/api/period/service/period.service';
import { PeriodResponse } from '../../../types/api/period.types';
import { cacheAcrossRequests } from '../lib/cacheAcrossRequests';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedPeriods = cacheAcrossRequests(periodService, ['periods'], {
  revalidate: 3600,
  tags: ['periods'],
});

// cache() dedupes calls within one request; cacheAcrossRequests persists across requests (not in dev).
export const getPeriods = cache(async (): Promise<PeriodResponse[]> => {
  try {
    return (await getCachedPeriods()).sort((a, b) => b.periodKey.localeCompare(a.periodKey));
  } catch (error) {
    return handleServiceError(error);
  }
});
