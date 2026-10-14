import 'server-only';
import type { SchoolListResult } from '@/app/types/api/schools.types';
import type { SchoolsParams } from '../types/index';
import { getSchools } from '../repo/schools.repo';

export async function schoolsService(params: SchoolsParams): Promise<SchoolListResult[]> {
  const schools = await getSchools(params.query);

  return schools.map((school) => ({
    school: school.canonical_name,
    schoolKey: school.school_key,
  }));
}
