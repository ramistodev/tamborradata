import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { Pagination, StatisticRankRaw } from '../types';
import {
  CursorPage,
  normalizeCursorPagination,
  normalizeOffsetPagination,
} from '../lib/pagination';

const RANK_COLUMNS =
  'statistic_id, group_school_id, entity_type, school_id, entity_key, entity_label, rank, value';

export async function getStatisticRanks(
  statisticId: string,
  pagination: Pagination = {}
): Promise<StatisticRankRaw[]> {
  const { limit, offset } = normalizeOffsetPagination(pagination);
  const { data: ranks, error: ranksError } = await supabaseClient
    .from(tables.statisticRanks)
    .select(RANK_COLUMNS)
    .eq('statistic_id', statisticId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (ranksError) {
    throw new ServerError(`Failed to fetch the statistic ranks: ${ranksError.message}`);
  }

  return ranks ?? [];
}

export interface RankCursorPagination {
  limit?: number;
  afterRank?: number;
}

export type RankCursorPage = CursorPage<StatisticRankRaw>;

function normalizeRankCursorPagination(pagination: RankCursorPagination): {
  limit: number;
  afterRank: number;
} {
  const { limit, after: afterRank } = normalizeCursorPagination(
    { limit: pagination.limit, after: pagination.afterRank },
    0
  );
  return { limit, afterRank };
}

export async function getStatisticRanksPage(
  statisticId: string,
  pagination: RankCursorPagination = {}
): Promise<RankCursorPage> {
  const { limit, afterRank } = normalizeRankCursorPagination(pagination);
  const { data: ranks, error: ranksError } = await supabaseClient
    .from(tables.statisticRanks)
    .select(RANK_COLUMNS)
    .eq('statistic_id', statisticId)
    .gt('rank', afterRank)
    .order('rank', { ascending: true })
    .limit(limit + 1);

  if (ranksError) {
    throw new ServerError(`Failed to fetch the statistic ranks page: ${ranksError.message}`);
  }

  const rows = ranks ?? [];
  const hasNextPage = rows.length > limit;

  return { items: hasNextPage ? rows.slice(0, limit) : rows, hasNextPage };
}
