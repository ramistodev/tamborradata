import { tables } from '../../../../types/dbSchema';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { PublishedPeriodRaw } from '../types';

export async function getAllPublishedPeriods(): Promise<PublishedPeriodRaw[]> {
  const { data, error } = await supabaseClient
    .from(tables.statsPeriods)
    .select('internal_key, public_slug, kind, last_published_at')
    .order('public_slug', { ascending: false })
    .eq('is_ready', true)
    .not('published_run_id', 'is', null);

  if (error) {
    throw new Error(error.message);
  }

  return data as PublishedPeriodRaw[];
}
