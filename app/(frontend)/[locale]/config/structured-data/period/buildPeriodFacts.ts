import type { PeriodResponse } from '@/app/types/api/period.types';
import type {
  StatisticCategory,
  StatisticRank,
  StatisticsResponse,
} from '@/app/types/api/statistics.types';
import { periodKind, type PeriodKind } from '@/app/types/period.types';
import {
  categoryDataShape,
  overviewMetricKey,
  statisticCategories,
  type StatisticCategories,
} from '@/app/types/statistics';

export type NamedValue = { label: string; value: number };

/** What the page says, as plain numbers and names: the raw material of the SEO texts. */
export type PeriodFacts = {
  period: string;
  kind: PeriodKind;
  /** First and last year with an edition, from the list of periods. */
  firstPeriod: string;
  lastPeriod: string;
  editions: number;
  /** Years between the first and the last edition without data (e.g. 2021). */
  missingYears: number[];

  participants: number | null;
  /** Percentage points (2.91 means +2.91 %). */
  growth: number | null;
  recordYear: number | null;
  recordCount: number | null;
  distinctNames: number | null;
  distinctSurnames: number | null;
  multipleNames: number | null;
  /** Percentage points, like `growth`. */
  multipleNamesRate: number | null;
  averageSchoolSize: number | null;
  schoolCount: number | null;

  topNames: NamedValue[];
  topSurnames: NamedValue[];
  topSchools: NamedValue[];
  newNames: string[];
  perennialNames: string[];
  schoolLongevity: NamedValue[];
  fastestGrowingSchool: NamedValue | null;
};

const MAX_LIST_ITEMS = 5;

/** Extracts the facts of a period from its statistics response and the list of periods. */
export function buildPeriodFacts(
  stats: StatisticsResponse,
  periods: PeriodResponse[]
): PeriodFacts {
  const { period, periodKind: kind } = stats.metaData;
  const coverage = editionsCoverage(periods, period);

  const overviewValue = (category: StatisticCategories, metricKey: string) =>
    stats.overview.find((item) => item.category === category && item.metricKey === metricKey)
      ?.valueNumeric ?? null;

  return {
    period,
    kind,
    ...coverage,

    participants: overviewValue(
      statisticCategories.totalParticipants,
      overviewMetricKey.participantCount
    ),
    growth: overviewValue(statisticCategories.participantsGrowthRate, overviewMetricKey.growthRate),
    recordYear: overviewValue(
      statisticCategories.participationRecordYears,
      overviewMetricKey.recordYear
    ),
    recordCount: overviewValue(
      statisticCategories.participationRecordYears,
      overviewMetricKey.recordParticipantCount
    ),
    distinctNames: overviewValue(
      statisticCategories.namesDiversity,
      overviewMetricKey.distinctCount
    ),
    distinctSurnames: overviewValue(
      statisticCategories.surnamesDiversity,
      overviewMetricKey.distinctCount
    ),
    multipleNames: overviewValue(
      statisticCategories.participantsWithMultipleNames,
      overviewMetricKey.participantsWithMultipleNames
    ),
    multipleNamesRate: overviewValue(
      statisticCategories.participantsWithMultipleNames,
      overviewMetricKey.multipleNamesRate
    ),
    averageSchoolSize: categoryValue(
      stats,
      statisticCategories.averageSchoolSize,
      'average_school_size'
    ),
    schoolCount: categoryValue(stats, statisticCategories.newVsVeteranSchoolRatio, 'school_count'),

    topNames: namedValues(ranksOf(stats, statisticCategories.topNames)),
    topSurnames: namedValues(ranksOf(stats, statisticCategories.topSurnames)),
    topSchools: namedValues(ranksOf(stats, statisticCategories.topSchools)),
    newNames: namedValues(ranksOf(stats, statisticCategories.newNames)).map(({ label }) => label),
    perennialNames: namedValues(ranksOf(stats, statisticCategories.perennialNames)).map(
      ({ label }) => label
    ),
    schoolLongevity: namedValues(ranksOf(stats, statisticCategories.schoolLongevity)),
    fastestGrowingSchool:
      namedValues(ranksOf(stats, statisticCategories.schoolGrowthRate), 1)[0] ?? null,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function findCategory(
  stats: StatisticsResponse,
  name: StatisticCategories
): StatisticCategory | undefined {
  return stats.families.flatMap((family) => family.categories).find((c) => c.category === name);
}

function ranksOf(stats: StatisticsResponse, name: StatisticCategories): StatisticRank[] {
  const category = findCategory(stats, name);

  return category?.dataShape === categoryDataShape.ranks ? category.data : [];
}

function categoryValue(
  stats: StatisticsResponse,
  name: StatisticCategories,
  metricKey: string
): number | null {
  const category = findCategory(stats, name);

  if (category?.dataShape !== categoryDataShape.values) {
    return null;
  }

  return category.data.find((metric) => metric.metricKey === metricKey)?.valueNumeric ?? null;
}

function namedValues(ranks: StatisticRank[], limit = MAX_LIST_ITEMS): NamedValue[] {
  return ranks
    .map((rank) => ({
      label:
        rank.entityLabel ?? rank.school?.canonicalName ?? rank.groupSchool?.canonicalName ?? '',
      value: rank.value,
    }))
    .filter(({ label }) => label !== '')
    .slice(0, limit);
}

/** First and last year with an edition, how many there are and which years in between have none. */
function editionsCoverage(periods: PeriodResponse[], currentPeriod: string) {
  const years = periods
    .filter((item) => item.kind === periodKind.year)
    .map((item) => Number(item.publicSlug))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);

  if (years.length === 0) {
    return { firstPeriod: currentPeriod, lastPeriod: currentPeriod, editions: 0, missingYears: [] };
  }

  const available = new Set(years);
  const first = years[0];
  const last = years[years.length - 1];
  const missingYears: number[] = [];

  for (let year = first; year <= last; year++) {
    if (!available.has(year)) {
      missingYears.push(year);
    }
  }

  return {
    firstPeriod: String(first),
    lastPeriod: String(last),
    editions: years.length,
    missingYears,
  };
}
