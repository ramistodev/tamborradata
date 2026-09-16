import 'server-only';
import type { StatisticsResponse } from '@/app/types/api/statistics.types';
import { buildStatisticsResponse } from './buildStatisticsResponse';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import {
  getAllStatisticValues,
  getPublishedEditorialSections,
  getPublishedPeriod,
  getPublishedStatisticHeaders,
  getStatisticRanks,
  getStatisticSeries,
} from '../repositories/statistics.repo';
import { categoryDataShape, editorialSections } from '../../../../types/statistics';
import type {
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticsHeader,
  StatisticValueRaw,
} from '../types';

export async function statisticsService(
  periodKey: string,
  locale: string
): Promise<StatisticsResponse> {
  const { publishedRunId } = await getPublishedPeriod(periodKey);
  const [statistics, summaries, allSchoolsById] = await Promise.all([
    getPublishedStatisticHeaders(publishedRunId),
    getPublishedEditorialSections(publishedRunId, locale),
    loadAllSchoolsById(),
  ]);
  const categoryHeaders = summaries.flatMap((summary) => {
    if (
      summary.section === editorialSections.periodIntro ||
      summary.section === editorialSections.periodOutro
    ) {
      return [];
    }

    return statistics.filter((statistic) => statistic.family === summary.section);
  });
  const categoryData = await Promise.all(
    categoryHeaders.map(async (statistic) => ({
      statistic,
      data: await getRawStatisticData(statistic),
    }))
  );

  return buildStatisticsResponse(periodKey, summaries, categoryData, allSchoolsById);
}

async function getRawStatisticData(
  statistic: StatisticsHeader
): Promise<StatisticRankRaw[] | StatisticSeriesPointRaw[] | StatisticValueRaw[]> {
  switch (statistic.data_shape) {
    case categoryDataShape.ranks:
      return getStatisticRanks(statistic.id);
    case categoryDataShape.values:
      return getAllStatisticValues(statistic.id);
    case categoryDataShape.series:
      return getStatisticSeries(statistic.id);
  }
}
