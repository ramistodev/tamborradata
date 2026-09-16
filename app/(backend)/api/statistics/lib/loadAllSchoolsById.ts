import { School } from '../../../../types/api/statistics.types';
import { resolveSchoolIds } from '../repositories/statistics.repo';
import { AllSchoolsById } from '../types';

export async function loadAllSchoolsById(): Promise<AllSchoolsById> {
  const allSchoolsById = new Map<string, School>();
  const schools = await resolveSchoolIds();
  for (const school of schools) {
    allSchoolsById.set(school.schoolId, school);
  }
  return allSchoolsById;
}
