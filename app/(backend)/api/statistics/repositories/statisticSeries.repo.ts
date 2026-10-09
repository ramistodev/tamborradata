import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError, ValidationError } from '../../../lib/errors';
import { tables } from '../../../../types/dbSchema';
import { entityType } from '../../../../types/statistics';
import { StatisticSeriesPointRaw } from '../types';
import { buildCursorPage, CursorPage, CursorPageRequest } from '../lib/pagination';
import { PREVIEW_ENTITIES, PREVIEW_PERIODS, PREVIEW_SCHOOLS } from '../lib/preview';
import { decodeSeriesCursor, encodeSeriesCursor } from '../../../lib/encript';

const SERIES_COLUMNS =
  'entity_type, school_id, entity_key, entity_label, metric_key, dimension_key, dimension_order, value';

/**
 * Vista previa del endpoint principal de estadísticas: los últimos `PREVIEW_PERIODS` periodos de
 * las `PREVIEW_ENTITIES` entidades principales (por valor agregado dentro de esa ventana), cada una
 * con su línea completa dentro de la ventana. Ordenar por agregado exige agrupar todas las filas,
 * por eso vive en la función de base de datos `get_top_statistic_series` en lugar de descargar una
 * categoría entera como surnameTrends (~10k entidades). Un agregado global (sin entidad ni
 * colegio) ya está acotado, así que la misma llamada solo lo recorta a los últimos periodos.
 *
 * Una serie por colegio (schoolsEvolution, schoolGrowthRate) devuelve los `PREVIEW_SCHOOLS`
 * colegios que participaron en más ediciones de la ventana, los de más participantes primero, de
 * modo que cada línea llega completa y todas las series por colegio muestran los mismos colegios.
 */
export async function getStatisticSeriesPreview(
  statisticId: string
): Promise<StatisticSeriesPointRaw[]> {
  const { data, error } = await supabaseClient.rpc('get_top_statistic_series', {
    p_statistic_id: statisticId,
    p_limit: PREVIEW_ENTITIES,
    p_periods: PREVIEW_PERIODS,
    p_school_limit: PREVIEW_SCHOOLS,
  });

  if (error) {
    throw new ServerError(`Failed to fetch the statistic series preview: ${error.message}`);
  }

  return (data ?? []) as StatisticSeriesPointRaw[];
}

/**
 * Una serie es por entidad (tendencias de nombres/apellidos: miles de entidades, una línea cada
 * una) o está acotada por naturaleza (un agregado global, o una línea por colegio: como mucho unas
 * decenas). El endpoint de detalle pagina las primeras y devuelve las segundas completas.
 */
async function isEntityKeyedSeries(statisticId: string): Promise<boolean> {
  const { data: peek, error: peekError } = await supabaseClient
    .from(tables.statisticSeries)
    .select('entity_type')
    .eq('statistic_id', statisticId)
    .limit(1)
    .maybeSingle();

  if (peekError) {
    throw new ServerError(
      `Failed to inspect the statistic series entity type: ${peekError.message}`
    );
  }

  return peek?.entity_type === entityType.name || peek?.entity_type === entityType.surname;
}

async function getFullStatisticSeries(statisticId: string): Promise<StatisticSeriesPointRaw[]> {
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

/**
 * Pagina por entidad, nunca por fila: el cursor es el último `entity_key` entregado y cada página
 * trae todos los puntos de sus entidades, así el histórico de una entidad no se corta por el
 * tamaño de página. Se pide una entidad extra solo para saber si existe una página siguiente.
 */
async function getStatisticSeriesEntityPage(
  statisticId: string,
  { limit: pageSize, cursor }: CursorPageRequest
): Promise<CursorPage<StatisticSeriesPointRaw>> {
  const decodedCursor = cursor ? decodeSeriesCursor(cursor) : null;

  if (decodedCursor && decodedCursor.statisticId !== statisticId) {
    throw new ValidationError("The 'cursor' parameter is not valid for this category");
  }

  const { data, error } = await supabaseClient.rpc('get_statistic_series_entity_page', {
    p_statistic_id: statisticId,
    p_limit: pageSize + 1,
    p_after_entity_key: decodedCursor?.lastEntityKey ?? null,
  });

  if (error) {
    throw new ServerError(`Failed to fetch the statistic series entity page: ${error.message}`);
  }

  const points = (data ?? []) as StatisticSeriesPointRaw[];
  const entityKeys = [
    ...new Set(
      points
        .map((point) => point.entity_key)
        .filter((entityKey): entityKey is string => typeof entityKey === 'string')
    ),
  ];
  const { items: pageEntityKeys, nextCursor } = buildCursorPage(
    entityKeys,
    pageSize,
    (lastEntityKey) =>
      encodeSeriesCursor({ version: 1, statisticId, lastEntityKey })
  );
  const pageEntities = new Set(pageEntityKeys);

  return {
    items: points.filter((point) => pageEntities.has(point.entity_key as string)),
    nextCursor,
  };
}

/**
 * Punto de entrada del endpoint de detalle: las tendencias de nombres/apellidos (por entidad)
 * se sirven paginadas por cursor; una serie acotada por naturaleza se devuelve completa, con todo
 * el histórico y `nextCursor: null`.
 */
export async function getStatisticSeriesPage(
  statisticId: string,
  request: CursorPageRequest
): Promise<CursorPage<StatisticSeriesPointRaw>> {
  if (!(await isEntityKeyedSeries(statisticId))) {
    if (request.cursor) {
      throw new ValidationError("The 'cursor' parameter is not valid for this category");
    }

    return { items: await getFullStatisticSeries(statisticId), nextCursor: null };
  }

  return getStatisticSeriesEntityPage(statisticId, request);
}
