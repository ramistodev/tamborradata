import type { School } from '../../../../types/api/statistics.types';
import { AllSchoolsById } from '../types';

const SCHOOL_PLACEHOLDER_PATTERN = /\{\{school:([^}]*)\}\}/gi;

/** Resolves the DB id into the public `School`, dropping the internal id. */
export function resolveSchool(schoolId: string, allSchoolsById: AllSchoolsById): School {
  const school = allSchoolsById.get(schoolId);
  if (!school) {
    throw new Error(`Failed to resolve school ID: ${schoolId}`);
  }
  const { canonicalName, schoolKey } = school;
  return { canonicalName, schoolKey };
}

export function resolveSchoolIdSummary(
  summaryText: string,
  allSchoolsById: AllSchoolsById
): string {
  const schoolIds = extractSchoolPlaceholderIds(summaryText);

  if (schoolIds.length === 0) {
    return summaryText;
  }

  return summaryText.replace(SCHOOL_PLACEHOLDER_PATTERN, (match, schoolId) => {
    const resolvedSchool = allSchoolsById.get(schoolId);
    if (!resolvedSchool) {
      throw new Error(`Failed to resolve school ID: ${schoolId}`);
    }
    return resolvedSchool.canonicalName;
  });
}

/** Every `{{school:...}}` placeholder's captured content, in order, well-formed or not. */
export function extractSchoolPlaceholderIds(text: string): string[] {
  return [...text.matchAll(SCHOOL_PLACEHOLDER_PATTERN)].map((match) => match[1]);
}
