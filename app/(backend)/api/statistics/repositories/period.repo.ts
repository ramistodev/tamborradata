import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { NotFoundError, ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { PublishedPeriod } from '../types';

export async function getPublishedPeriod(periodKey: string): Promise<PublishedPeriod> {
  const { data: period, error: periodError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('id, published_run_id, kind')
    .eq('internal_key', periodKey)
    .not('published_run_id', 'is', null)
    .single();

  if (periodError) {
    if (periodError.code === 'PGRST116') {
      throw new NotFoundError('No published period was found for the given key.');
    }

    throw new ServerError(`Failed to fetch the published period: ${periodError.message}`);
  }

  if (!period?.published_run_id) {
    throw new NotFoundError('No published period was found for the given key.');
  }

  return { runId: period.published_run_id, kind: period.kind };
}
