import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { Pagination, StatisticSeriesPointRaw } from '../types';
import {
  CursorPage,
  normalizeCursorPagination,
  normalizeOffsetPagination,
} from '../lib/pagination';

const SERIES_COLUMNS =
  'statistic_id, entity_type, school_id, entity_key, entity_label, metric_key, dimension_key, dimension_order, value';

export async function getStatisticSeries(
  statisticId: string,
  pagination: Pagination = {}
): Promise<StatisticSeriesPointRaw[]> {
  const { limit, offset } = normalizeOffsetPagination(pagination);
  const { data: series, error: seriesError } = await supabaseClient
    .from(tables.statisticSeries)
    .select(SERIES_COLUMNS)
    .eq('statistic_id', statisticId)
    .order('dimension_order', { ascending: true })
    .order('dimension_key', { ascending: true })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (seriesError) {
    throw new ServerError(`Failed to fetch the statistic series: ${seriesError.message}`);
  }

  return series ?? [];
}

async function getAllStatisticSeries(statisticId: string): Promise<StatisticSeriesPointRaw[]> {
  const { data: series, error: seriesError } = await supabaseClient
    .from(tables.statisticSeries)
    .select(SERIES_COLUMNS)
    .eq('statistic_id', statisticId)
    .order('dimension_order', { ascending: true })
    .order('dimension_key', { ascending: true })
    .order('id', { ascending: true });

  if (seriesError) {
    throw new ServerError(`Failed to fetch the full statistic series: ${seriesError.message}`);
  }

  return series ?? [];
}

const MAX_POINTS_PER_ENTITY = 30;

export interface SeriesCursorPagination {
  limit?: number;
  afterEntityKey?: string | null;
}

export type SeriesCursorPage = CursorPage<StatisticSeriesPointRaw>;

function normalizeSeriesCursorPagination(pagination: SeriesCursorPagination): {
  limit: number;
  afterEntityKey: string | null;
} {
  const { limit, after: afterEntityKey } = normalizeCursorPagination(
    { limit: pagination.limit, after: pagination.afterEntityKey ?? undefined },
    null
  );
  return { limit, afterEntityKey };
}

async function getStatisticSeriesEntityPage(
  statisticId: string,
  pagination: SeriesCursorPagination = {}
): Promise<SeriesCursorPage> {
  const { limit, afterEntityKey } = normalizeSeriesCursorPagination(pagination);

  let query = supabaseClient
    .from(tables.statisticSeries)
    .select(SERIES_COLUMNS)
    .eq('statistic_id', statisticId)
    .not('entity_key', 'is', null)
    .order('entity_key', { ascending: true })
    .order('dimension_order', { ascending: true })
    .order('id', { ascending: true })
    .limit((limit + 1) * MAX_POINTS_PER_ENTITY);

  if (afterEntityKey) {
    query = query.gt('entity_key', afterEntityKey);
  }

  const { data: rows, error: seriesError } = await query;

  if (seriesError) {
    throw new ServerError(`Failed to fetch the statistic series entity page: ${seriesError.message}`);
  }

  const entityGroups: StatisticSeriesPointRaw[][] = [];
  const entityIndexByKey = new Map<string, number>();

  for (const row of rows ?? []) {
    const entityKey = row.entity_key as string;
    let groupIndex = entityIndexByKey.get(entityKey);

    if (groupIndex === undefined) {
      groupIndex = entityGroups.length;
      entityIndexByKey.set(entityKey, groupIndex);
      entityGroups.push([]);
    }

    entityGroups[groupIndex].push(row);
  }

  const hasNextPage = entityGroups.length > limit;
  const pageGroups = hasNextPage ? entityGroups.slice(0, limit) : entityGroups;

  return { items: pageGroups.flat(), hasNextPage };
}

/**
 * Entry point for the category-detail endpoint: decides between the two series strategies above
 * by peeking at `entity_type` on a single row, then fetches accordingly. Statistics with no
 * `entity_key` (global aggregate or per-school series, both naturally bounded — see
 * `getAllStatisticSeries`) are returned whole with `hasNextPage: false`; name/surname trends use
 * the entity cursor.
 */
export async function getStatisticSeriesForDetail(
  statisticId: string,
  pagination: SeriesCursorPagination = {}
): Promise<SeriesCursorPage> {
  const { data: peek, error: peekError } = await supabaseClient
    .from(tables.statisticSeries)
    .select('entity_type')
    .eq('statistic_id', statisticId)
    .limit(1)
    .maybeSingle();

  if (peekError) {
    throw new ServerError(`Failed to inspect the statistic series entity type: ${peekError.message}`);
  }

  const isEntityKeyed = peek?.entity_type === 'name' || peek?.entity_type === 'surname';

  if (!isEntityKeyed) {
    const items = await getAllStatisticSeries(statisticId);
    return { items, hasNextPage: false };
  }

  return getStatisticSeriesEntityPage(statisticId, pagination);
}
