import { tables } from '../../../../types/dbSchema';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { PublishedPeriod } from '../types';

export async function getAllPublishedPeriods(): Promise<PublishedPeriod[]> {
  const { data, error } = await supabaseClient
    .from(tables.statsPeriods)
    .select('internal_key, public_slug, kind')
    .eq('is_ready', true);

  if (error) {
    throw new Error(error.message);
  }

  return data as PublishedPeriod[];
}
