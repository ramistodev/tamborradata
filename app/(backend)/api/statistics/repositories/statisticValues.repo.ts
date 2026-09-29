import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { StatisticValueRaw } from '../types';

export async function getAllStatisticValues(statisticId: string): Promise<StatisticValueRaw[]> {
  const { data: values, error: valuesError } = await supabaseClient
    .from(tables.statisticValues)
    .select('statistic_id, metric_key, value_numeric, value_text, value_boolean')
    .eq('statistic_id', statisticId)
    .order('metric_key', { ascending: true })
    .order('id', { ascending: true });

  if (valuesError) {
    throw new ServerError(`Failed to fetch the statistic values: ${valuesError.message}`);
  }

  return values ?? [];
}
