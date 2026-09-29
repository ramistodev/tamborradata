import 'server-only';
import type { CategoryDetailResponse } from '@/app/types/api/statistics.types';
import { categoryDataShape } from '../../../../types/statistics';
import type { CategoryDetailParams } from '../dtos/category.schema';
import { assertStatisticPresentation } from '../lib/assertStatisticPresentation';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { normalizeData } from '../lib/normalizeData';
import { getPublishedPeriod } from '../repositories/period.repo';
import { getPublishedStatisticByCategory } from '../repositories/statisticHeaders.repo';
import { getStatisticRanksPage } from '../repositories/statisticRanks.repo';
import { getStatisticSeriesForDetail } from '../repositories/statisticSeries.repo';
import { getAllStatisticValues } from '../repositories/statisticValues.repo';

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

  // `renderer_key` is trusted from the persisted row, not re-derived from a category mapping.
  // `assertStatisticPresentation` above is what guarantees at runtime that it is the exact value
  // this category/shape pair allows — the casts below only tell TS what that already established.
  if (statistic.data_shape === categoryDataShape.values) {
    const raw = await getAllStatisticValues(statistic.id);
    return {
      category: statistic.category,
      rendererKey: statistic.renderer_key,
      dataShape: statistic.data_shape,
      data: normalizeData(raw, statistic.data_shape, allSchoolsById),
    } as CategoryDetailResponse;
  }

  if (statistic.data_shape === categoryDataShape.series) {
    const { items, hasNextPage } = await getStatisticSeriesForDetail(statistic.id, {
      limit,
      afterEntityKey: cursor.afterEntityKey,
    });
    const lastItem = items.at(-1);

    return {
      category: statistic.category,
      rendererKey: statistic.renderer_key,
      dataShape: categoryDataShape.series,
      data: normalizeData(items, statistic.data_shape, allSchoolsById),
      pageInfo: {
        hasNextPage,
        nextCursor: hasNextPage && lastItem ? (lastItem.entity_key ?? null) : null,
      },
    } as CategoryDetailResponse;
  }

  const { items, hasNextPage } = await getStatisticRanksPage(statistic.id, {
    limit,
    afterRank: cursor.afterRank,
  });
  const lastItem = items.at(-1);

  return {
    category: statistic.category,
    rendererKey: statistic.renderer_key,
    dataShape: statistic.data_shape,
    data: normalizeData(items, statistic.data_shape, allSchoolsById),
    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage && lastItem ? lastItem.rank : null,
    },
  } as CategoryDetailResponse;
}
