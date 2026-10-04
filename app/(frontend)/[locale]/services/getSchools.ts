import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { checkSchoolsParams } from '../../../(backend)/api/schools/dtos/schools.schema';
import { schoolsService } from '../../../(backend)/api/schools/services/schools.service';
import { SchoolListResult } from '../../../types/api/schools.types';
import { handleServiceError } from '../lib/handleServiceError';

const getCachedSchools = unstable_cache(schoolsService, ['schools'], {
  revalidate: 3600,
  tags: ['schools'],
});

// cache() dedupes calls within one request; unstable_cache persists across requests.
export const getSchools = cache(async (query: string | null = null): Promise<SchoolListResult[]> => {
  try {
    return await getCachedSchools(checkSchoolsParams(query));
  } catch (error) {
    return handleServiceError(error);
  }
});
