import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { NotFoundError, PeriodMovedError, ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { PublishedPeriod } from '../types';

export async function getPublishedPeriod(publicSlug: string): Promise<PublishedPeriod> {
  const { data: period, error: periodError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('id, published_run_id, kind, public_slug, last_published_at, updated_at')
    .eq('public_slug', publicSlug)
    .eq('is_ready', true)
    .not('published_run_id', 'is', null)
    .single();

  if (periodError) {
    if (periodError.code === 'PGRST116') {
      await throwIfMoved(publicSlug);
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

// Check if the period has been moved to a new slug and throw a PeriodMovedError if so
async function throwIfMoved(publicSlug: string): Promise<void> {
  const { data, error } = await supabaseClient
    .from(tables.statsPeriodSlugAliases)
    .select('stats_periods!inner(public_slug)')
    .eq('slug', publicSlug)
    .not('stats_periods.published_run_id', 'is', null)
    .maybeSingle();

  if (error) throw new ServerError(`Failed to resolve the slug alias: ${error.message}`);
  if (!data) return;

  // If the target period exists and has a different slug, throw a PeriodMovedError
  const target = Array.isArray(data.stats_periods) ? data.stats_periods[0] : data.stats_periods;

  // Never redirect to the same slug, it would loop
  if (target?.public_slug && target.public_slug !== publicSlug) {
    throw new PeriodMovedError(target.public_slug);
  }
}
