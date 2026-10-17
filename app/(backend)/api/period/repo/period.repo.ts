import { tables } from '../../../../types/dbSchema';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { PublishedPeriodRaw } from '../types';

export async function getAllPublishedPeriods(): Promise<PublishedPeriodRaw[]> {
  const { data, error } = await supabaseClient
    .from(tables.statsPeriods)
    .select('internal_key, public_slug, kind')
    .order('public_slug', { ascending: false })
    .eq('is_ready', true);

  if (error) {
    throw new Error(error.message);
  }

  return data as PublishedPeriodRaw[];
}
