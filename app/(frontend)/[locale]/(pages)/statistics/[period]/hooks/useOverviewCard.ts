import { useFormatter, useTranslations } from 'next-intl';
import { OverviewStatistic, PeriodData } from '@/app/types/api/statistics.types';
import { periodKind } from '@/app/types/period.types';
import {
  overviewMetricKey,
  StatisticCategories,
  OverviewMetricKey,
  statisticCategories,
} from '@/app/types/statistics';

export type MetricSize = 'hero' | 'large' | 'normal';
export type MetricTone = 'default' | 'accent' | 'positive' | 'negative';

/** One cell of the overview card: a main value plus an optional, smaller secondary line. */
export type Metric = {
  label: string;
  value: string;
  secondary?: string;
  size?: MetricSize;
  tone?: MetricTone;
  fullWidthOnMobile?: boolean;
};

const isPresent = (metric: Metric | null): metric is Metric => metric !== null;

/** Turns the raw `overview` of a period into the titled rows of metrics the card renders. */
export function useOverviewCard({
  periodData,
  overview,
}: {
  periodData: PeriodData;
  overview: OverviewStatistic[];
}) {
  const t = useTranslations('Statistics.overview');
  const format = useFormatter();
  const isGlobal = periodData.periodKind === periodKind.global;

  // ── Raw values ──────────────────────────────────────────────────────────
  const getValue = (category: StatisticCategories, metricKey: OverviewMetricKey) =>
    overview.find((item) => item.category === category && item.metricKey === metricKey)
      ?.valueNumeric ?? null;

  const participants = getValue(statisticCategories.totalParticipants, overviewMetricKey.participantCount);
  const growth = getValue(statisticCategories.participantsGrowthRate, overviewMetricKey.growthRate);
  const recordCount = getValue(
    statisticCategories.participationRecordYears,
    overviewMetricKey.recordParticipantCount
  );
  const recordYear = getValue(statisticCategories.participationRecordYears, overviewMetricKey.recordYear);
  const multipleNames = getValue(
    statisticCategories.participantsWithMultipleNames,
    overviewMetricKey.participantsWithMultipleNames
  );
  const multipleNamesRate = getValue(
    statisticCategories.participantsWithMultipleNames,
    overviewMetricKey.multipleNamesRate
  );

  // ── Formatting ──────────────────────────────────────────────────────────
  // 'always': Spanish skips the thousands separator on 4-digit numbers (5149) by default
  const formatCount = (value: number) => format.number(value, { useGrouping: 'always' });

  // The backend sends percentages as 19.43, not 0.1943
  const formatPercentage = (value: number, { signed = false } = {}) =>
    format.number(value / 100, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...(signed && { signDisplay: 'exceptZero' }),
    });

  // ── Metrics ─────────────────────────────────────────────────────────────
  const participantsMetric = (): Metric | null => {
    if (participants === null) return null;

    return {
      label: t('participants'),
      value: formatCount(participants),
      secondary: isGlobal
        ? t('participantsGlobalSub')
        : t('participantsSub', { period: periodData.period }),
      size: 'hero',
      tone: 'accent',
      fullWidthOnMobile: true,
    };
  };

  const growthMetric = (): Metric | null => {
    if (growth === null || participants === null) return null;

    // growth_rate is rounded, so the previous edition is an estimate rounded to the unit
    const previousParticipants = Math.round(participants / (1 + growth / 100));

    return {
      label: t('growth'),
      value: formatPercentage(growth, { signed: true }),
      secondary: t('growthSub', {
        previous: formatCount(previousParticipants),
        current: formatCount(participants),
      }),
      size: 'large',
      tone: growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'default',
    };
  };

  const recordMetric = (): Metric | null => {
    if (recordCount === null) return null;

    return {
      label: t('record'),
      value: formatCount(recordCount),
      secondary: recordYear === null ? undefined : t('recordSub', { year: recordYear }),
      size: 'large',
    };
  };

  /** Distinct count as the main value, diversity percentage as the secondary line. */
  const diversityMetric = (
    label: string,
    distinctCount: number | null,
    diversityPercentage: number | null
  ): Metric | null => {
    if (distinctCount === null) return null;

    return {
      label,
      value: formatCount(distinctCount),
      secondary:
        diversityPercentage === null
          ? undefined
          : t('diversitySub', { percentage: formatPercentage(diversityPercentage) }),
    };
  };

  const multipleNamesMetric = (): Metric | null => {
    if (multipleNames === null) return null;

    return {
      label: t('multipleNames'),
      value: formatCount(multipleNames),
      secondary:
        multipleNamesRate === null
          ? undefined
          : t('multipleNamesSub', { percentage: formatPercentage(multipleNamesRate) }),
    };
  };

  // ── Rows ────────────────────────────────────────────────────────────────
  // First row: the headline number and, next to it, what changed (or the all-time record)
  const headlineRow = [participantsMetric(), isGlobal ? recordMetric() : growthMetric()];

  // Second row: diversity of names and surnames
  const diversityRow = [
    diversityMetric(
      t('distinctNames'),
      getValue(statisticCategories.namesDiversity, overviewMetricKey.distinctCount),
      getValue(statisticCategories.namesDiversity, overviewMetricKey.diversityPercentage)
    ),
    diversityMetric(
      t('distinctSurnames'),
      getValue(statisticCategories.surnamesDiversity, overviewMetricKey.distinctCount),
      getValue(statisticCategories.surnamesDiversity, overviewMetricKey.diversityPercentage)
    ),
    multipleNamesMetric(),
  ];

  const rows = [headlineRow, diversityRow]
    .map((row) => row.filter(isPresent))
    .filter((row) => row.length > 0);

  return { title: t('title', { period: periodData.period }), rows };
}
