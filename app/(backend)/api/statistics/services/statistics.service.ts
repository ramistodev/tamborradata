import 'server-only';
import type { StatisticsResponse } from '@/app/types/api/statistics.types';
import {
  buildStatisticsResponse,
  selectFamilyStatistics,
  selectOverviewStatistics,
} from './buildStatisticsResponse';
import { assertStatisticPresentation } from '../lib/assertStatisticPresentation';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { getPublishedPeriod } from '../repositories/period.repo';
import { getPublishedStatisticHeaders } from '../repositories/statisticHeaders.repo';
import { getPublishedEditorialSections } from '../repositories/editorialSections.repo';
import {
  getSchoolGroupedRanksPreview,
  getStatisticRanksPreview,
} from '../repositories/statisticRanks.repo';
import { getStatisticSeriesPreview } from '../repositories/statisticSeries.repo';
import { getAllStatisticValues } from '../repositories/statisticValues.repo';
import { categoryDataShape, schoolGroupedRankCategories } from '../../../../types/statistics';
import type {
  StatisticParams,
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticsHeader,
  StatisticValueRaw,
} from '../types';
import { CursorPage } from '../lib/pagination';

export async function statisticsService(params: StatisticParams): Promise<StatisticsResponse> {
  const { periodKey, locale } = params;

  const publishedPeriod = await getPublishedPeriod(periodKey); // runId publicado y tipo de periodo
  const [statistics, summaries, allSchoolsById] = await Promise.all([
    getPublishedStatisticHeaders(publishedPeriod.runId),
    getPublishedEditorialSections(publishedPeriod.runId, locale),
    loadAllSchoolsById(),
  ]);

  for (const statistic of statistics) {
    assertStatisticPresentation(statistic, publishedPeriod.kind);
  }

  const familyStatistics = selectFamilyStatistics(statistics, summaries);
  const categoryData = await Promise.all(
    familyStatistics.map(async (statistic) => ({
      statistic,
      data: await getRawStatisticData(statistic),
    }))
  );

  const overviewStatistics = selectOverviewStatistics(statistics);
  // Crear un map con [statistic.id, data] para poder filtrarla
  const categoryDataById = new Map(categoryData.map((entry) => [entry.statistic.id, entry]));

  // Filtrar solo las estadisticas que estan en el overview y que el periodo tambien los tiene
  const overviewData = overviewStatistics.flatMap((statistic) => {
    const entry = categoryDataById.get(statistic.id);
    return entry ? [{ statistic, data: entry.data as StatisticValueRaw[] }] : [];
  });

  return buildStatisticsResponse(periodKey, summaries, categoryData, overviewData, allSchoolsById);
}

async function getRawStatisticData(
  statistic: StatisticsHeader
): Promise<CursorPage<StatisticRankRaw> | StatisticSeriesPointRaw[] | StatisticValueRaw[]> {
  switch (statistic.data_shape) {
    case categoryDataShape.ranks:
      return schoolGroupedRankCategories.has(statistic.category)
        ? getSchoolGroupedRanksPreview(statistic.id)
        : getStatisticRanksPreview(statistic.id);
    case categoryDataShape.values:
      return getAllStatisticValues(statistic.id);
    case categoryDataShape.series:
      return getStatisticSeriesPreview(statistic.id);
  }
}
