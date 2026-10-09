import 'server-only';
import { cache } from 'react';
import { checkSchoolsParams } from '../../../(backend)/api/schools/dtos/schools.schema';
import { schoolsService } from '../../../(backend)/api/schools/services/schools.service';
import { SchoolListResult } from '../../../types/api/schools.types';
import { cacheAcrossRequests } from '../lib/cacheAcrossRequests';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedSchools = cacheAcrossRequests(schoolsService, ['schools'], {
  revalidate: 3600,
  tags: ['schools'],
});

// cache() dedupes calls within one request; cacheAcrossRequests persists across requests (not in dev).
export const getSchools = cache(async (query: string | null = null): Promise<SchoolListResult[]> => {
  try {
    return await getCachedSchools(checkSchoolsParams(query));
  } catch (error) {
    return handleServiceError(error);
  }
});
