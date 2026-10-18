import 'server-only';
import type { StatisticsResponse } from '@/app/types/api/statistics.types';
import { buildStatisticsResponse, selectOverviewStatistics } from './buildStatisticsResponse';
import { assertStatisticPresentation } from '../lib/assertStatisticPresentation';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { getPublishedPeriod } from '../repo/period.repo';
import { getPublishedStatisticHeaders } from '../repo/statisticHeaders.repo';
import { getOptionalEditorialSections } from '../repo/editorialSections.repo';
import {
  getSchoolGroupedRanksPreview,
  getStatisticRanksPreview,
} from '../repo/statisticRanks.repo';
import { getStatisticSeriesPreview } from '../repo/statisticSeries.repo';
import { getAllStatisticValues } from '../repo/statisticValues.repo';
import {
  categoryDataShape,
  schoolGroupedRankCategories,
  statisticCategories,
} from '../../../../types/statistics';
import type {
  StatisticParams,
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticsHeader,
  StatisticValueRaw,
} from '../types';
import { CursorPage } from '../lib/pagination';

const KNOWN_CATEGORIES = new Set<string>(Object.values(statisticCategories));

export async function statisticsService(params: StatisticParams): Promise<StatisticsResponse> {
  const { publicSlug, locale } = params;

  const publishedPeriod = await getPublishedPeriod(publicSlug); // runId publicado y tipo de periodo
  const [publishedStatistics, summaries, allSchoolsById] = await Promise.all([
    getPublishedStatisticHeaders(publishedPeriod.runId),
    getOptionalEditorialSections(publishedPeriod.runId, locale),
    loadAllSchoolsById(),
  ]);

  // A run published before a category was removed still carries it: skip it instead of failing the page
  const statistics = publishedStatistics.filter((statistic) =>
    KNOWN_CATEGORIES.has(statistic.category)
  );

  for (const statistic of statistics) {
    assertStatisticPresentation(statistic, publishedPeriod.kind);
  }

  const categoryData = await Promise.all(
    statistics.map(async (statistic) => ({
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

  return buildStatisticsResponse(
    publishedPeriod.metaData,
    summaries,
    categoryData,
    overviewData,
    allSchoolsById
  );
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
