import 'server-only';
import { overviewService } from '../../../(backend)/api/overview/service/overview.service';
import { cacheAcrossRequests } from '../lib/cacheAcrossRequests';
import { cache } from 'react';
import { handleServiceError } from '../lib/handleServiceError';
import { OverviewResponse, OverviewScope } from '../../../types/api/overview.types';

const getCachedOverview = cacheAcrossRequests(overviewService, ['overview'], {
  revalidate: 3600,
  tags: ['overview'],
});

// cache() dedupes calls within one request; cacheAcrossRequests persists across requests (not in dev).
export const getOverview = cache(async (scope: OverviewScope): Promise<OverviewResponse> => {
  try {
    return await getCachedOverview(scope);
  } catch (error) {
    return handleServiceError(error);
  }
});
