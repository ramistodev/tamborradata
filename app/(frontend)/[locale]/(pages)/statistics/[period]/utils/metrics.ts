import type { useFormatter } from 'next-intl';
import type { StatisticValue } from '../../../../../../types/api/statistics.types';

export const metricFormat = {
  integer: 'integer',
  /** A calendar year: no thousands separator (2024, not 2.024). */
  year: 'year',
  decimal: 'decimal',
  /** The backend sends percentages as 19.43, not 0.1943. */
  percent: 'percent',
  text: 'text',
} as const;

type MetricFormat = (typeof metricFormat)[keyof typeof metricFormat];

type MetricConfig = {
  format: MetricFormat;
  /** Fraction digits of a `decimal` or `percent`. */
  digits?: number;
  /** Always show the sign (growth: +3,2 % / -3,2 %). */
  signed?: boolean;
};

/**
 * Every metric a `values` category can carry, in display order: inside a card the first metric is
 * the big one. A metric that is not listed here (`eligible_resolved_participants`, `window_year`:
 * context rows that travel with a category) is not shown. Each key needs its label in
 * `Statistics.metrics`.
 */
export const METRICS = {
  participant_count: { format: metricFormat.integer },
  growth_rate: { format: metricFormat.percent, digits: 2, signed: true },

  record_participant_count: { format: metricFormat.integer },
  record_year: { format: metricFormat.year },
  record_year_count: { format: metricFormat.integer },

  diversity_percentage: { format: metricFormat.percent, digits: 2 },
  distinct_count: { format: metricFormat.integer },
  observation_count: { format: metricFormat.integer },
  shannon_entropy: { format: metricFormat.decimal, digits: 2 },

  leading_key: { format: metricFormat.text },
  leading_count: { format: metricFormat.integer },
  leading_share: { format: metricFormat.percent, digits: 2 },
  top_k_share: { format: metricFormat.percent, digits: 2 },
  herfindahl_index: { format: metricFormat.decimal, digits: 4 },

  participants_with_multiple_names: { format: metricFormat.integer },
  multiple_names_rate: { format: metricFormat.percent, digits: 2 },

  average_length: { format: metricFormat.decimal, digits: 2 },
  average_school_size: { format: metricFormat.decimal, digits: 1 },

  new_count: { format: metricFormat.integer },
  veteran_count: { format: metricFormat.integer },
  intermediate_count: { format: metricFormat.integer },
  school_count: { format: metricFormat.integer },
  new_vs_veteran_ratio: { format: metricFormat.decimal, digits: 3 },
} as const satisfies Record<string, MetricConfig>;

export type MetricKey = keyof typeof METRICS;

const METRIC_ORDER = Object.keys(METRICS);

export function isMetricKey(key: string): key is MetricKey {
  return key in METRICS;
}

/** Metrics of a category that are shown, in display order. */
export function visibleMetrics(data: StatisticValue[]): (StatisticValue & { key: MetricKey })[] {
  return data
    .flatMap((metric) =>
      isMetricKey(metric.metricKey) ? [{ ...metric, key: metric.metricKey }] : []
    )
    .sort((a, b) => METRIC_ORDER.indexOf(a.key) - METRIC_ORDER.indexOf(b.key));
}

export function formatMetric(
  metric: StatisticValue,
  key: MetricKey,
  format: ReturnType<typeof useFormatter>
): string {
  const config: MetricConfig = METRICS[key];

  if (config.format === metricFormat.text) {
    return metric.valueText ?? '—';
  }

  const value = metric.valueNumeric;

  if (value === null || value === undefined) {
    return '—';
  }

  switch (config.format) {
    case metricFormat.percent:
      return format.number(value / 100, {
        style: 'percent',
        maximumFractionDigits: config.digits,
        signDisplay: config.signed ? 'exceptZero' : 'auto',
      });
    case metricFormat.decimal:
      return format.number(value, { maximumFractionDigits: config.digits });
    case metricFormat.year:
      return format.number(value, { useGrouping: false });
    default:
      return format.number(value, { useGrouping: 'always' });
  }
}
