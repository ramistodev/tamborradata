import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError, ValidationError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { StatisticRankRaw } from '../types';
import { buildCursorPage, CursorPage, CursorPageRequest } from '../lib/pagination';
import { PREVIEW_GROUPS, PREVIEW_RANKS } from '../lib/preview';
import { decodeRankCursor, encodeRankCursor, RankCursorPayload } from '../../../lib/encript';

// `id` solo se lee para construir el cursor de paginación y desempatar por `rank`; nunca llega a la
// respuesta de la API.
const RANK_COLUMNS =
  'id, group_school_id, entity_type, school_id, entity_key, entity_label, rank, value';

const TOP_RANK = 1;

/** Vista previa de un ranking global: las primeras `PREVIEW_RANKS` posiciones. */
export async function getStatisticRanksPreview(
  statisticId: string
): Promise<CursorPage<StatisticRankRaw>> {
  const { data: ranks, error: ranksError } = await supabaseClient
    .from(tables.statisticRanks)
    .select(RANK_COLUMNS)
    .eq('statistic_id', statisticId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true })
    .limit(PREVIEW_RANKS + 1);

  if (ranksError) {
    throw new ServerError(`Failed to fetch the statistic ranks preview: ${ranksError.message}`);
  }

  return buildCursorPage(ranks ?? [], PREVIEW_RANKS, (lastDelivered) =>
    encodeGlobalRankCursor(statisticId, lastDelivered)
  );
}

function validateRankCursor<T extends RankCursorPayload['variant']>(
  decodedCursor: RankCursorPayload,
  statisticId: string,
  variant: T
): Extract<RankCursorPayload, { variant: T }> {
  if (decodedCursor.statisticId !== statisticId || decodedCursor.variant !== variant) {
    throw new ValidationError("The 'cursor' parameter is not valid for this category");
  }

  return decodedCursor as Extract<RankCursorPayload, { variant: T }>;
}

/**
 * Pagina un ranking global por `(rank, id)`: `rank` por sí solo no es único, así que un cursor
 * sobre él saltaría todas las entradas empatadas que queden tras el límite de la página. `id`
 * desempata y mantiene el orden estable.
 */
export async function getStatisticRanksPage(
  statisticId: string,
  { limit: pageSize, cursor }: CursorPageRequest
): Promise<CursorPage<StatisticRankRaw>> {
  const decodedCursor = cursor ? decodeRankCursor(cursor) : null;

  let query = supabaseClient
    .from(tables.statisticRanks)
    .select(RANK_COLUMNS)
    .eq('statistic_id', statisticId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true })
    .limit(pageSize + 1);

  if (decodedCursor) {
    const rankCursor = validateRankCursor(decodedCursor, statisticId, 'global-rank');
    query = query.or(
      `rank.gt.${rankCursor.rank},and(rank.eq.${rankCursor.rank},id.gt.${rankCursor.lastId})`
    );
  }

  const { data: ranks, error: ranksError } = await query;

  if (ranksError) {
    throw new ServerError(`Failed to fetch the statistic ranks page: ${ranksError.message}`);
  }

  return buildCursorPage(ranks ?? [], pageSize, (lastDelivered) =>
    encodeGlobalRankCursor(statisticId, lastDelivered)
  );
}

/**
 * Consulta común de los rankings agrupados por colegio: solo el puesto 1 de cada colegio, ordenado
 * por `group_school_id`. `(statistic_id, group_school_id, rank)` es único, así que hay como mucho
 * una fila por colegio y `group_school_id` es un cursor estable sin necesidad de desempate.
 */
function selectTopRankPerSchool(statisticId: string, size: number, afterSchoolId?: string) {
  let query = supabaseClient
    .from(tables.statisticRanks)
    .select(RANK_COLUMNS)
    .eq('statistic_id', statisticId)
    .eq('rank', TOP_RANK)
    .not('group_school_id', 'is', null)
    .order('group_school_id', { ascending: true })
    .limit(size);

  if (afterSchoolId) {
    query = query.gt('group_school_id', afterSchoolId);
  }

  return query;
}

/** Vista previa de un ranking por colegio: el puesto 1 de los primeros `PREVIEW_GROUPS` colegios. */
export async function getSchoolGroupedRanksPreview(
  statisticId: string
): Promise<CursorPage<StatisticRankRaw>> {
  const { data: ranks, error: ranksError } = await selectTopRankPerSchool(
    statisticId,
    PREVIEW_GROUPS + 1
  );

  if (ranksError) {
    throw new ServerError(
      `Failed to fetch the school-grouped ranks preview: ${ranksError.message}`
    );
  }

  return buildCursorPage(ranks ?? [], PREVIEW_GROUPS, (lastDelivered) =>
    encodeSchoolGroupedRankCursor(statisticId, lastDelivered)
  );
}

/** Pagina un ranking por colegio de a colegios; el cursor es el `group_school_id` del último. */
export async function getSchoolGroupedRanksPage(
  statisticId: string,
  { limit: pageSize, cursor }: CursorPageRequest
): Promise<CursorPage<StatisticRankRaw>> {
  const decodedCursor = cursor
    ? validateRankCursor(decodeRankCursor(cursor), statisticId, 'school-grouped-rank')
    : null;

  const { data: ranks, error: ranksError } = await selectTopRankPerSchool(
    statisticId,
    pageSize + 1,
    decodedCursor?.groupSchoolId
  );

  if (ranksError) {
    throw new ServerError(`Failed to fetch the school-grouped ranks page: ${ranksError.message}`);
  }

  return buildCursorPage(ranks ?? [], pageSize, (lastDelivered) =>
    encodeSchoolGroupedRankCursor(statisticId, lastDelivered)
  );
}

function encodeGlobalRankCursor(statisticId: string, row: StatisticRankRaw): string {
  return encodeRankCursor({
    version: 1,
    statisticId,
    variant: 'global-rank',
    lastId: row.id,
    rank: row.rank,
  });
}

function encodeSchoolGroupedRankCursor(statisticId: string, row: StatisticRankRaw): string {
  if (!row.group_school_id) {
    throw new ServerError('Failed to create the school-grouped ranks cursor');
  }

  return encodeRankCursor({
    version: 1,
    statisticId,
    variant: 'school-grouped-rank',
    groupSchoolId: row.group_school_id,
  });
}
