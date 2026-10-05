import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { NotFoundError, ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { PublishedPeriod } from '../types';

export async function getPublishedPeriod(publicSlug: string): Promise<PublishedPeriod> {
  const { data: period, error: periodError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('id, published_run_id, kind, public_slug, last_published_at, updated_at')
    .eq('public_slug', publicSlug)
    .not('published_run_id', 'is', null)
    .single();

  if (periodError) {
    if (periodError.code === 'PGRST116') {
      throw new NotFoundError('No published period was found for the given slug.');
    }

    throw new ServerError(`Failed to fetch the published period: ${periodError.message}`);
  }

  if (!period?.published_run_id) {
    throw new NotFoundError('No published period was found for the given slug.');
  }

  return {
    runId: period.published_run_id,
    kind: period.kind,
    metaData: {
      period: period.public_slug,
      periodKind: period.kind,
      publishedAt: period.last_published_at,
      updatedAt: period.updated_at,
    },
  };
}
