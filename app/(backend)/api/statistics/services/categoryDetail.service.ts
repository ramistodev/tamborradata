import 'server-only';
import type { CategoryDetailResponse } from '@/app/types/api/statistics.types';
import { categoryDataShape, statisticCategoryRendererKey } from '../../../../types/statistics';
import type { CategoryDetailParams } from '../dtos/category.schema';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { normalizeData } from '../lib/normalizeData';
import {
  getAllStatisticValues,
  getPublishedPeriod,
  getPublishedStatisticByCategory,
  getStatisticRanksPage,
  getStatisticSeries,
} from '../repositories/statistics.repo';

export async function categoryDetailService(
  params: CategoryDetailParams
): Promise<CategoryDetailResponse> {
  const { periodKey, category, limit, afterRank } = params;
  const { publishedRunId } = await getPublishedPeriod(periodKey);
  const [statistic, allSchoolsById] = await Promise.all([
    getPublishedStatisticByCategory(publishedRunId, category),
    loadAllSchoolsById(),
  ]);

  if (statistic.data_shape === categoryDataShape.values) {
    const raw = await getAllStatisticValues(statistic.id);
    return {
      category: statistic.category,
      rendererKey: statisticCategoryRendererKey[statistic.category],
      dataShape: statistic.data_shape,
      data: normalizeData(raw, statistic.data_shape, allSchoolsById),
    };
  }

  if (statistic.data_shape === categoryDataShape.series) {
    const raw = await getStatisticSeries(statistic.id);

    return {
      category: statistic.category,
      rendererKey: statisticCategoryRendererKey[statistic.category],
      dataShape: categoryDataShape.series,
      data: normalizeData(raw, statistic.data_shape, allSchoolsById),
    };
  }

  const { items, hasNextPage } = await getStatisticRanksPage(statistic.id, { limit, afterRank });
  const lastItem = items.at(-1);

  return {
    category: statistic.category,
    rendererKey: statisticCategoryRendererKey[statistic.category],
    dataShape: statistic.data_shape,
    data: normalizeData(items, statistic.data_shape, allSchoolsById),
    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage && lastItem ? lastItem.rank : null,
    },
  };
}
