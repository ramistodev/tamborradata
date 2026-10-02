import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { NotFoundError, ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { StatisticsHeader } from '../types';

export async function getPublishedStatisticHeaders(
  publishedRunId: string
): Promise<StatisticsHeader[]> {
  const { data: statisticHeader, error: headerError } = await supabaseClient
    .from(tables.statistics)
    .select('id, category, data_shape, renderer_key, family')
    .eq('run_id', publishedRunId)
    .order('category', { ascending: true })
    .order('id', { ascending: true });

  if (headerError) {
    throw new ServerError(`Failed to fetch the statistic headers: ${headerError.message}`);
  }

  if (!statisticHeader || statisticHeader.length === 0) {
    throw new ServerError('No statistic headers were found for the given period.');
  }

  return statisticHeader;
}

export async function getPublishedStatisticByCategory(
  publishedRunId: string,
  category: string
): Promise<StatisticsHeader> {
  const { data: statistic, error: statisticError } = await supabaseClient
    .from(tables.statistics)
    .select('id, category, data_shape, renderer_key, family')
    .eq('run_id', publishedRunId)
    .eq('category', category)
    .maybeSingle();

  if (statisticError) {
    throw new ServerError(`Failed to fetch the statistic category: ${statisticError.message}`);
  }

  if (!statistic) {
    throw new NotFoundError(
      `No statistic category was found for '${category}' in the given period.`
    );
  }

  return statistic;
}
