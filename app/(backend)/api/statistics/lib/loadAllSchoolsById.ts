import { resolveSchoolIds } from '../repo/schools.repo';
import { AllSchoolsById, SchoolWithId } from '../types';

export async function loadAllSchoolsById(): Promise<AllSchoolsById> {
  const allSchoolsById = new Map<string, SchoolWithId>();
  const schools = await resolveSchoolIds();
  for (const school of schools) {
    allSchoolsById.set(school.schoolId, school);
  }
  return allSchoolsById;
}
