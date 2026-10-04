import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { periodService } from '../../../(backend)/api/period/service/period.service';
import { PeriodResponse } from '../../../types/api/period.types';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedPeriods = unstable_cache(periodService, ['periods'], {
  revalidate: 3600,
  tags: ['periods'],
});

// cache() dedupes calls within one request; unstable_cache persists across requests.
export const getPeriods = cache(async (): Promise<PeriodResponse[]> => {
  try {
    return await getCachedPeriods();
  } catch (error) {
    return handleServiceError(error);
  }
});
