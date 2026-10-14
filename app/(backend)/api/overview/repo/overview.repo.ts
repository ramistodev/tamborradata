import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { statisticCategories } from '../../../../types/statistics';
import { OverviewPeriodRow, OverviewStatisticRow } from '../types';

const TOP_RANK = 1;

const OVERVIEW_CATEGORIES = [
  statisticCategories.totalParticipants,
  statisticCategories.participantsGrowthRate,
  statisticCategories.topNames,
  statisticCategories.topSurnames,
  statisticCategories.topSchools,
];

/** Every period with a published run (the global one and one per year with data). */
export async function getPublishedPeriods(): Promise<OverviewPeriodRow[]> {
  const { data: periods, error: periodsError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('published_run_id, kind, public_slug, start_year, end_year, last_published_at')
    .not('published_run_id', 'is', null)
    .returns<OverviewPeriodRow[]>();

  if (periodsError) {
    throw new ServerError(`Failed to fetch the published periods: ${periodsError.message}`);
  }

  return periods ?? [];
}

/**
 * The overview categories of a run with what the overview reads from each: its scalar values and
 * the first place of its global ranking. `statistic_ranks` points twice to `schools`, so the join
 * names the `school_id` foreign key (the one that holds the ranked school).
 */
export async function getOverviewStatistics(runId: string): Promise<OverviewStatisticRow[]> {
  const { data: statistics, error: statisticsError } = await supabaseClient
    .from(tables.statistics)
    .select(
      `id, category,
       statistic_values(metric_key, value_numeric),
       statistic_ranks(entity_label, value, schools!statistic_ranks_school_id_fkey(canonical_name))`
    )
    .eq('run_id', runId)
    .in('category', OVERVIEW_CATEGORIES)
    .eq('statistic_ranks.rank', TOP_RANK)
    .is('statistic_ranks.group_school_id', null)
    .returns<OverviewStatisticRow[]>();

  if (statisticsError) {
    throw new ServerError(`Failed to fetch the overview statistics: ${statisticsError.message}`);
  }

  return statistics ?? [];
}

/** `topSchools` ranks every school of the period once, so its size is the number of schools. */
export async function countRankedSchools(topSchoolsStatisticId: string): Promise<number> {
  const { count, error: countError } = await supabaseClient
    .from(tables.statisticRanks)
    .select('id', { count: 'exact', head: true })
    .eq('statistic_id', topSchoolsStatisticId)
    .is('group_school_id', null);

  if (countError) {
    throw new ServerError(`Failed to count the ranked schools: ${countError.message}`);
  }

  return count ?? 0;
}
