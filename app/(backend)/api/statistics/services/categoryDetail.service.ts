import 'server-only';
import type {
  CategoryDetailResponse,
  StatisticRank,
  StatisticSeriesPoint,
  StatisticValue,
} from '@/app/types/api/statistics.types';
import { categoryDataShape, schoolGroupedRankCategories } from '../../../../types/statistics';
import type { CategoryDetailParams } from '../dtos/category.schema';
import { assertStatisticPresentation } from '../lib/assertStatisticPresentation';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { normalizeData } from '../lib/normalizeData';
import { getPublishedPeriod } from '../repositories/period.repo';
import { getPublishedStatisticByCategory } from '../repositories/statisticHeaders.repo';
import {
  getSchoolGroupedRanksPage,
  getStatisticRanksPage,
} from '../repositories/statisticRanks.repo';
import { getStatisticSeriesPage } from '../repositories/statisticSeries.repo';
import { getAllStatisticValues } from '../repositories/statisticValues.repo';
import type { StatisticsHeader } from '../types';

export async function categoryDetailService(
  params: CategoryDetailParams
): Promise<CategoryDetailResponse> {
  const { periodKey, category, limit, cursor } = params;
  const { runId, kind } = await getPublishedPeriod(periodKey);
  const [statistic, allSchoolsById] = await Promise.all([
    getPublishedStatisticByCategory(runId, category),
    loadAllSchoolsById(),
  ]);

  assertStatisticPresentation(statistic, kind);

  if (statistic.data_shape === categoryDataShape.values) {
    const raw = await getAllStatisticValues(statistic.id);
    return toDetailResponse(
      statistic,
      normalizeData(raw, statistic.data_shape, allSchoolsById),
      null
    );
  }

  if (statistic.data_shape === categoryDataShape.series) {
    const { items, nextCursor } = await getStatisticSeriesPage(statistic.id, { limit, cursor });
    return toDetailResponse(
      statistic,
      normalizeData(items, statistic.data_shape, allSchoolsById),
      nextCursor
    );
  }

  const getRanksPage = schoolGroupedRankCategories.has(statistic.category)
    ? getSchoolGroupedRanksPage
    : getStatisticRanksPage;
  const { items, nextCursor } = await getRanksPage(statistic.id, { limit, cursor });

  return toDetailResponse(
    statistic,
    normalizeData(items, statistic.data_shape, allSchoolsById),
    nextCursor
  );
}

/**
 * `renderer_key` se toma de la fila persistida y no se vuelve a derivar de un mapeo de categorías:
 * `assertStatisticPresentation` garantiza en tiempo de ejecución que es exactamente el valor que
 * permite esa combinación de categoría y forma de datos. El cast solo le indica a TS lo que esa
 * verificación ya estableció.
 */
function toDetailResponse(
  statistic: StatisticsHeader,
  data: StatisticRank[] | StatisticSeriesPoint[] | StatisticValue[],
  nextCursor: string | null
): CategoryDetailResponse {
  return {
    category: statistic.category,
    rendererKey: statistic.renderer_key,
    dataShape: statistic.data_shape,
    data,
    pageInfo: { nextCursor },
  } as CategoryDetailResponse;
}
