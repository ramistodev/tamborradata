import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { tables } from '../../../../types/dbSchema';
import { NotFoundError } from '../../../lib/errors';
import { ParticipantRow } from '../types';

export async function fetchParticipants(
  partialName: string,
  schoolKey: string
): Promise<ParticipantRow[]> {
  const { data: participants, error } = await supabaseClient
    .from(tables.participants)
    .select(
      'id, name, name_key, year, school:schools!inner(id, canonical_name, school_key), scraped_url:scraped_urls(url)'
    )
    .ilike('name', `%${partialName}%`)
    .eq('school.school_key', schoolKey)
    .order('year', { ascending: false })
    .returns<ParticipantRow[]>();

  if (error) {
    throw new Error(`Error fetching participants: ${error.message}`);
  }

  if (!participants || participants.length === 0) {
    throw new NotFoundError('No participants found for the given name and schoolKey');
  }

  return participants;
}
