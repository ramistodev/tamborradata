import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { NotFoundError } from '../../../lib/errors';
import type { School } from '../../../../types/api/statistics.types';
import {
  Pagination,
  PublishedEditorialSection,
  PublishedPeriod,
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticsHeader,
  StatisticValueRaw,
} from '../types';
import { statisticSummariesStatus, tables } from '../../../../types/dbSchema';

function normalizePagination(pagination: Pagination = {}): Required<Pagination> {
  const { limit = 10, offset = 0 } = pagination;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Pagination limit must be a positive integer.');
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error('Pagination offset must be a non-negative integer.');
  }

  return { limit: Math.min(limit, 100), offset };
}

export async function getPublishedPeriod(periodKey: string): Promise<PublishedPeriod> {
  const { data: period, error: periodError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('id, published_run_id')
    .eq('internal_key', periodKey)
    .not('published_run_id', 'is', null)
    .single();

  if (periodError) {
    if (periodError.code === 'PGRST116') {
      throw new NotFoundError('No published period was found for the given key.');
    }

    throw new Error(`Failed to fetch the published period: ${periodError.message}`);
  }

  if (!period?.published_run_id) {
    throw new NotFoundError('No published period was found for the given key.');
  }

  return { publishedRunId: period.published_run_id };
}

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
    throw new Error(`Failed to fetch the statistic headers: ${headerError.message}`);
  }

  if (!statisticHeader || statisticHeader.length === 0) {
    throw new Error('No statistic headers were found for the given period.');
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
    throw new Error(`Failed to fetch the statistic category: ${statisticError.message}`);
  }

  if (!statistic) {
    throw new NotFoundError(
      `No statistic category was found for '${category}' in the given period.`
    );
  }

  return statistic;
}

export async function getStatisticRanks(
  statisticId: string,
  pagination: Pagination = {}
): Promise<StatisticRankRaw[]> {
  const { limit, offset } = normalizePagination(pagination);
  const { data: ranks, error: ranksError } = await supabaseClient
    .from(tables.statisticRanks)
    .select(
      'statistic_id, group_school_id, entity_type, school_id, entity_key, entity_label, rank, value'
    )
    .eq('statistic_id', statisticId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (ranksError) {
    throw new Error(`Failed to fetch the statistic ranks: ${ranksError.message}`);
  }

  return ranks ?? [];
}

const DEFAULT_RANK_PAGE_SIZE = 25;
const MAX_RANK_PAGE_SIZE = 100;

export interface RankCursorPagination {
  limit?: number;
  afterRank?: number;
}

export interface RankCursorPage {
  items: StatisticRankRaw[];
  hasNextPage: boolean;
}

function normalizeRankCursorPagination(
  pagination: RankCursorPagination
): Required<RankCursorPagination> {
  const { limit = DEFAULT_RANK_PAGE_SIZE, afterRank = 0 } = pagination;
  return { limit: Math.min(limit, MAX_RANK_PAGE_SIZE), afterRank };
}

/**
 * Cursor-based rank pagination for infinite-scroll rankings: fetches `limit + 1`
 * rows past `afterRank` so `hasNextPage` can be derived without a COUNT query.
 *
 * Assumes `rank` is unique per statistic (true for flat rankings such as
 * topNames/topSchools). Categories with a `group_school_id` (e.g.
 * commonNameBySchool) repeat rank 1..N once per group, so an `afterRank`-only
 * cursor can skip tied rows once a page boundary falls mid-tie. Those grouped
 * categories are consumed as a full table by the frontend, not scrolled, so
 * this is not exercised in practice — but do not reuse this cursor for a
 * grouped ranking without adding a tie-breaking cursor field.
 */
export async function getStatisticRanksPage(
  statisticId: string,
  pagination: RankCursorPagination = {}
): Promise<RankCursorPage> {
  const { limit, afterRank } = normalizeRankCursorPagination(pagination);
  const { data: ranks, error: ranksError } = await supabaseClient
    .from(tables.statisticRanks)
    .select(
      'statistic_id, group_school_id, entity_type, school_id, entity_key, entity_label, rank, value'
    )
    .eq('statistic_id', statisticId)
    .gt('rank', afterRank)
    .order('rank', { ascending: true })
    .limit(limit + 1);

  if (ranksError) {
    throw new Error(`Failed to fetch the statistic ranks page: ${ranksError.message}`);
  }

  const rows = ranks ?? [];
  const hasNextPage = rows.length > limit;

  return { items: hasNextPage ? rows.slice(0, limit) : rows, hasNextPage };
}

export async function getStatisticSeries(
  statisticId: string,
  pagination: Pagination = {}
): Promise<StatisticSeriesPointRaw[]> {
  const { limit, offset } = normalizePagination(pagination);
  const { data: series, error: seriesError } = await supabaseClient
    .from(tables.statisticSeries)
    .select(
      'statistic_id, entity_type, school_id, entity_key, entity_label, metric_key, dimension_key, dimension_order, value'
    )
    .eq('statistic_id', statisticId)
    .order('dimension_order', { ascending: true })
    .order('dimension_key', { ascending: true })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (seriesError) {
    throw new Error(`Failed to fetch the statistic series: ${seriesError.message}`);
  }

  return series ?? [];
}

export async function getAllStatisticValues(statisticId: string): Promise<StatisticValueRaw[]> {
  const { data: values, error: valuesError } = await supabaseClient
    .from(tables.statisticValues)
    .select('statistic_id, metric_key, value_numeric, value_text, value_boolean, value_json')
    .eq('statistic_id', statisticId)
    .order('metric_key', { ascending: true })
    .order('id', { ascending: true });

  if (valuesError) {
    throw new Error(`Failed to fetch the statistic values: ${valuesError.message}`);
  }

  return values ?? [];
}

export async function getPublishedEditorialSections(
  publishedRunId: string,
  locale: string
): Promise<PublishedEditorialSection[]> {
  const { data: summaries, error: summariesError } = await supabaseClient
    .from(tables.statisticSummaries)
    .select('id, section, locale, template')
    .eq('run_id', publishedRunId)
    .eq('locale', locale)
    .eq('status', statisticSummariesStatus.published)
    .order('section', { ascending: true })
    .order('id', { ascending: true });

  if (summariesError) {
    throw new Error(`Failed to fetch the published editorial sections: ${summariesError.message}`);
  }

  const filteredSummaries = summaries?.filter(
    (summary) => summary.template !== null && summary.template.trim() !== ''
  );

  return filteredSummaries?.map((summary) => {
    return {
      id: summary.id,
      section: summary.section,
      locale: summary.locale,
      template: summary.template,
    };
  }) as PublishedEditorialSection[];
}

export async function resolveSchoolIds(): Promise<School[]> {
  const { data: school, error: schoolError } = await supabaseClient
    .from(tables.schools)
    .select('id, canonical_name, school_key');

  if (schoolError) {
    throw new Error(`Failed to fetch the school: ${schoolError.message}`);
  }
  if (!school) {
    throw new Error('No school was found.');
  }

  return school.map((s) => {
    return {
      schoolId: s.id,
      canonicalName: s.canonical_name,
      schoolKey: s.school_key,
    };
  }) as School[];
}
