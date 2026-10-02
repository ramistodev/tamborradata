import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import type { School } from '../../../../types/api/statistics.types';

export async function resolveSchoolIds(): Promise<School[]> {
  const { data: school, error: schoolError } = await supabaseClient
    .from(tables.schools)
    .select('id, canonical_name, school_key');

  if (schoolError) {
    throw new ServerError(`Failed to fetch the school: ${schoolError.message}`);
  }
  if (!school) {
    throw new Error('No school was found.');
  }

  return school.map((s) => {
    return {
      schoolId: s.id,
      canonicalName: s.canonical_name,
      schoolKey: s.school_key,
    };
  }) as School[];
}
