import type {
  CategoryDetailResponse,
  PeriodData,
  RankCategory,
  School,
  SeriesCategory,
  StatisticFamily,
  StatisticRank,
  StatisticSeriesPoint,
  StatisticValue,
  StatisticsResponse,
  ValuesCategory,
} from '@/app/types/api/statistics.types';
import type { PeriodKind } from '@/app/types/period.types';
import {
  statisticCategoryPeriodConfig,
  type CategoryFamilies,
  type StatisticCategories,
} from '@/app/types/statistics';

type Shape = 'values' | 'ranks' | 'series';

function presentationOf(category: StatisticCategories, kind: PeriodKind, shape: Shape) {
  const config = statisticCategoryPeriodConfig as unknown as Record<
    string,
    Partial<Record<PeriodKind, { dataShape: string; rendererKey: string }>>
  >;
  const presentation = config[category]?.[kind];
  if (!presentation) throw new Error(`category ${category} has no presentation for kind ${kind}`);
  if (presentation.dataShape !== shape) {
    throw new Error(`category ${category} for kind ${kind} has shape ${presentation.dataShape}, not ${shape}`);
  }
  return presentation;
}

export function makeStatisticsMeta(overrides: Partial<PeriodData> = {}): PeriodData {
  return {
    period: '2024',
    periodKind: 'year',
    publishedAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-01T10:00:00.000Z',
    ...overrides,
  };
}

export function makeSchoolRef(overrides: Partial<School> = {}): School {
  return { canonicalName: 'Ikastola Test', schoolKey: 'ikastola-test', ...overrides };
}

export function makeStatisticRank(rank: number, overrides: Partial<StatisticRank> = {}): StatisticRank {
  return {
    entityType: 'name',
    entityKey: `name-${rank}`,
    entityLabel: `Name ${rank}`,
    rank,
    value: 1000 - rank,
    ...overrides,
  };
}

export function makeStatisticValue(
  metricKey: string,
  valueNumeric: number | null,
  overrides: Partial<StatisticValue> = {},
): StatisticValue {
  return { metricKey, valueNumeric, ...overrides };
}

export function makeSeriesPoint(overrides: Partial<StatisticSeriesPoint> = {}): StatisticSeriesPoint {
  return {
    entityType: 'name',
    entityKey: 'ane',
    entityLabel: 'Ane',
    metricKey: 'count',
    dimensionKey: '2024',
    dimensionOrder: 2024,
    value: 10,
    ...overrides,
  };
}

export function makeValuesCategory(
  category: StatisticCategories,
  data: StatisticValue[] = [makeStatisticValue('participant_count', 1234)],
  kind: PeriodKind = 'year',
): ValuesCategory {
  const { dataShape, rendererKey } = presentationOf(category, kind, 'values');
  return { category, dataShape, rendererKey, data } as unknown as ValuesCategory;
}

export function makeRanksCategory(
  category: StatisticCategories,
  data: StatisticRank[] = [makeStatisticRank(1), makeStatisticRank(2), makeStatisticRank(3)],
  nextCursor: string | null = null,
  kind: PeriodKind = 'year',
): RankCategory {
  const { dataShape, rendererKey } = presentationOf(category, kind, 'ranks');
  return { category, dataShape, rendererKey, data, pageInfo: { nextCursor } } as unknown as RankCategory;
}

export function makeSeriesCategory(
  category: StatisticCategories,
  data: StatisticSeriesPoint[] = [
    makeSeriesPoint({ dimensionKey: '2023', dimensionOrder: 2023, value: 8 }),
    makeSeriesPoint(),
  ],
  kind: PeriodKind = 'global',
): SeriesCategory {
  const { dataShape, rendererKey } = presentationOf(category, kind, 'series');
  return { category, dataShape, rendererKey, data } as unknown as SeriesCategory;
}

export function makeFamily(
  family: CategoryFamilies,
  categories: StatisticFamily['categories'],
  summary = '',
): StatisticFamily {
  return { family, template: { section: family, summary }, categories };
}

/** Defaults to a year period: one values family, one names ranking with a next cursor, one schools ranking. */
export function makeStatisticsResponse(overrides: Partial<StatisticsResponse> = {}): StatisticsResponse {
  return {
    metaData: makeStatisticsMeta(),
    overview: [{ category: 'totalParticipants', metricKey: 'participant_count', valueNumeric: 1234 }],
    intro: { section: 'periodIntro', summary: 'Intro **text**' },
    families: [
      makeFamily('participationDynamics', [
        makeValuesCategory('totalParticipants', [makeStatisticValue('participant_count', 1234)]),
      ]),
      makeFamily('names', [makeRanksCategory('topNames', undefined, 'cursor-1')]),
      makeFamily('schools', [makeRanksCategory('topSchools')]),
    ],
    outro: { section: 'periodOutro', summary: 'Outro text' },
    ...overrides,
  };
}

/** A global-period response is `makeStatisticsResponse({ metaData: makeStatisticsMeta({ period: 'global', periodKind: 'global' }) })` with categories built with kind 'global'. */
export function makeCategoryDetail(
  category: StatisticCategories,
  shape: Shape,
  nextCursor: string | null = null,
  kind: PeriodKind = 'year',
): CategoryDetailResponse {
  const base =
    shape === 'ranks'
      ? makeRanksCategory(category, undefined, nextCursor, kind)
      : shape === 'series'
        ? makeSeriesCategory(category, undefined, kind)
        : makeValuesCategory(category, undefined, kind);

  return {
    category: base.category,
    rendererKey: base.rendererKey,
    dataShape: base.dataShape,
    data: base.data,
    pageInfo: { nextCursor },
  } as unknown as CategoryDetailResponse;
}
