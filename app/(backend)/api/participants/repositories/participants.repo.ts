import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { nameResolutionStatus, tables } from '../../../../types/dbSchema';
import { ParticipantRow } from '../types';

const toArrayLiteral = (units: string[]) =>
  `{${units.map((unit) => `"${unit.replace(/["\\]/g, '\\$&')}"`).join(',')}}`;

/**
 * Resolved participants of a school with at least one typed unit among their names and another
 * among their surnames. Any compatible record has both, so this never leaves out a match.
 */
export async function fetchParticipants(
  units: string[],
  schoolKey: string
): Promise<ParticipantRow[]> {
  const typedUnits = toArrayLiteral(units);

  const { data: participants, error } = await supabaseClient
    .from(tables.participants)
    .select(
      `name, name_key, year,
       school:schools!inner(canonical_name, school_key),
       scraped_url:scraped_urls(url),
       resolution:participant_name_resolutions!inner(name_keys, surname_keys)`
    )
    .eq('school.school_key', schoolKey)
    .eq('resolution.status', nameResolutionStatus.resolved)
    .overlaps('resolution.name_keys', typedUnits)
    .overlaps('resolution.surname_keys', typedUnits)
    .returns<ParticipantRow[]>();

  if (error) {
    throw new Error(`Error fetching participants: ${error.message}`);
  }

  return participants ?? [];
}
