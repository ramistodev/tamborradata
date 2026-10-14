import 'server-only';
import { NotFoundError, ServerError } from '../../../lib/errors';
import { periodKind } from '../../../../types/period.types';
import {
  overviewMetricKey,
  StatisticCategories,
  statisticCategories,
} from '../../../../types/statistics';
import {
  OverviewResponse,
  OverviewScope,
  overviewScope,
} from '../../../../types/api/overview.types';
import {
  countRankedSchools,
  getOverviewStatistics,
  getPublishedPeriods,
} from '../repo/overview.repo';
import { OverviewPeriodRow, OverviewStatisticRow } from '../types';

type TopEntry = { label: string; count: number };

export async function overviewService(scope: OverviewScope): Promise<OverviewResponse> {
  const periods = await getPublishedPeriods(); // Get all published periods

  const yearPeriods = periods
    .filter((period) => period.kind === periodKind.year)
    .sort((a, b) => (b.start_year ?? 0) - (a.start_year ?? 0));

  const [globalPeriod, lastPeriod] = await Promise.all([
    scope === overviewScope.last
      ? undefined
      : buildGlobalPeriod(
          periods.find((period) => period.kind === periodKind.global),
          yearPeriods
        ),
    scope === overviewScope.global ? undefined : buildLastPeriod(yearPeriods[0]),
  ]);

  return { globalPeriod, lastPeriod };
}

async function buildGlobalPeriod(
  period: OverviewPeriodRow | undefined,
  yearPeriods: OverviewPeriodRow[]
): Promise<NonNullable<OverviewResponse['globalPeriod']>> {
  if (!period) throw new NotFoundError('No published global period was found.');

  const { startYear, endYear } = readYearRange(period);
  const missingYears = findMissingYears(startYear, endYear, yearPeriods);
  const facts = await readPeriodFacts(period);

  return {
    publicSlug: period.public_slug,
    startYear,
    endYear,
    totalParticipations: facts.totalParticipations,
    totalSchools: facts.totalSchools,
    editionsCount: endYear - startYear + 1 - missingYears.length,
    missingYears,
    lastPublishedAt: readLastPublishedAt(period),
    topName: facts.topName,
    topSurname: facts.topSurname,
    topSchool: facts.topSchool,
  };
}

async function buildLastPeriod(
  period: OverviewPeriodRow | undefined
): Promise<NonNullable<OverviewResponse['lastPeriod']>> {
  if (!period) throw new NotFoundError('No published year period was found.');

  const facts = await readPeriodFacts(period);

  return {
    publicSlug: period.public_slug,
    year: readYearRange(period).startYear,
    totalParticipations: facts.totalParticipations,
    totalSchools: facts.totalSchools,
    growthRate: facts.growthRate,
    lastPublishedAt: readLastPublishedAt(period),
    topName: facts.topName,
    topSurname: facts.topSurname,
    topSchool: facts.topSchool,
  };
}

async function readPeriodFacts(period: OverviewPeriodRow) {
  const statistics = await getOverviewStatistics(period.published_run_id);
  const byCategory = new Map(statistics.map((statistic) => [statistic.category, statistic]));

  const topSchools = requireStatistic(byCategory, statisticCategories.topSchools, period);
  const totalParticipants = requireStatistic(
    byCategory,
    statisticCategories.totalParticipants,
    period
  );

  return {
    totalParticipations: requireValue(
      totalParticipants,
      overviewMetricKey.participantCount,
      period
    ),
    // Only periods that follow another edition have a growth rate
    growthRate: findValue(
      byCategory.get(statisticCategories.participantsGrowthRate),
      overviewMetricKey.growthRate
    ),
    totalSchools: await countRankedSchools(topSchools.id),
    topName: readTop(requireStatistic(byCategory, statisticCategories.topNames, period), period),
    topSurname: readTop(
      requireStatistic(byCategory, statisticCategories.topSurnames, period),
      period
    ),
    topSchool: readTop(topSchools, period),
  };
}

function requireStatistic(
  byCategory: Map<StatisticCategories, OverviewStatisticRow>,
  category: StatisticCategories,
  period: OverviewPeriodRow
): OverviewStatisticRow {
  const statistic = byCategory.get(category);

  if (!statistic) {
    throw new ServerError(`The '${category}' statistic is missing in period ${period.public_slug}`);
  }

  return statistic;
}

function findValue(statistic: OverviewStatisticRow | undefined, metricKey: string): number | null {
  const value = statistic?.statistic_values.find((row) => row.metric_key === metricKey);

  return value?.value_numeric == null ? null : Number(value.value_numeric);
}

function requireValue(
  statistic: OverviewStatisticRow,
  metricKey: string,
  period: OverviewPeriodRow
): number {
  const value = findValue(statistic, metricKey);

  if (value === null) {
    throw new ServerError(`The '${metricKey}' metric is missing in period ${period.public_slug}`);
  }

  return value;
}

/** First place of a global ranking. A tie keeps the first row the DB returns. */
function readTop(statistic: OverviewStatisticRow, period: OverviewPeriodRow): TopEntry {
  const first = statistic.statistic_ranks[0];
  const label = first?.schools?.canonical_name ?? first?.entity_label;

  if (!first || !label) {
    throw new ServerError(
      `The '${statistic.category}' ranking is empty in period ${period.public_slug}`
    );
  }

  return { label, count: Number(first.value) };
}

function readYearRange(period: OverviewPeriodRow) {
  if (period.start_year === null || period.end_year === null) {
    throw new ServerError(`Period ${period.public_slug} has no year range`);
  }

  return { startYear: period.start_year, endYear: period.end_year };
}

function readLastPublishedAt(period: OverviewPeriodRow): string {
  if (!period.last_published_at) {
    throw new ServerError(`Period ${period.public_slug} has no publication date`);
  }

  return period.last_published_at;
}

/** Years of the range that have no published year period (no edition or no data). */
function findMissingYears(
  startYear: number,
  endYear: number,
  yearPeriods: OverviewPeriodRow[]
): number[] {
  const published = new Set(yearPeriods.map((period) => period.start_year));
  const missing: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    if (!published.has(year)) missing.push(year);
  }

  return missing;
}
