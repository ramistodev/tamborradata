import { createFormatter } from 'next-intl';
import { describe, expect, it } from 'vitest';
import {
  formatMetric,
  isMetricKey,
  metricFormat,
  METRICS,
  visibleMetrics,
  type MetricKey,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/metrics';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { makeStatisticValue } from '@/test/fixtures/statistics';

const formatEs = createFormatter({ locale: 'es', timeZone: 'Europe/Madrid' } as never) as never;
const formatEn = createFormatter({ locale: 'en', timeZone: 'Europe/Madrid' } as never) as never;

const metricKeys = Object.keys(METRICS) as MetricKey[];

describe('metrics', () => {
  describe('isMetricKey', () => {
    it('accepts a configured metric', () => {
      expect(isMetricKey('participant_count')).toBe(true);
    });

    it('rejects an unknown metric', () => {
      expect(isMetricKey('nope')).toBe(false);
    });
  });

  describe('METRICS', () => {
    it('maps every key to a known metric format', () => {
      const formats: string[] = Object.values(metricFormat);
      const offenders = metricKeys.filter((key) => !formats.includes(METRICS[key].format));

      expect(offenders).toEqual([]);
    });

    it.each(LOCALES)('has a label for every key in the %s translations', (locale) => {
      const labels = messagesByLocale[locale].Statistics.metrics as Record<string, unknown>;
      const offenders = metricKeys.filter((key) => typeof labels[key] !== 'string');

      expect(offenders).toEqual([]);
    });
  });

  describe('visibleMetrics', () => {
    it('keeps the known metrics in METRICS order and adds their key', () => {
      const data = [
        makeStatisticValue('record_year', 2019),
        makeStatisticValue('unknown_metric', 1),
        makeStatisticValue('participant_count', 1234),
      ];

      const result = visibleMetrics(data);

      expect(result.map((metric) => metric.key)).toEqual(['participant_count', 'record_year']);
      expect(result[0]).toEqual({ ...data[2], key: 'participant_count' });
      expect(result[1]).toEqual({ ...data[0], key: 'record_year' });
    });

    it('does not mutate the input', () => {
      const data = [
        makeStatisticValue('record_year', 2019),
        makeStatisticValue('participant_count', 1234),
      ];

      visibleMetrics(data);

      expect(data.map((metric) => metric.metricKey)).toEqual(['record_year', 'participant_count']);
    });

    it('returns an empty array for an empty input', () => {
      expect(visibleMetrics([])).toEqual([]);
    });
  });

  describe('formatMetric (es)', () => {
    it('formats an integer with thousands separator', () => {
      expect(formatMetric(makeStatisticValue('participant_count', 1234), 'participant_count', formatEs)).toBe('1.234');
    });

    it('formats a year without thousands separator', () => {
      expect(formatMetric(makeStatisticValue('record_year', 2024), 'record_year', formatEs)).toBe('2024');
    });

    it.each([
      { key: 'shannon_entropy', value: 3.14159, expected: '3,14' },
      { key: 'average_school_size', value: 42.5, expected: '42,5' },
      { key: 'herfindahl_index', value: 0.5, expected: '0,5' },
    ] as const)('formats the decimal $key', ({ key, value, expected }) => {
      expect(formatMetric(makeStatisticValue(key, value), key, formatEs)).toBe(expected);
    });

    it('formats a percentage', () => {
      const result = formatMetric(makeStatisticValue('diversity_percentage', 19.43), 'diversity_percentage', formatEs);

      expect(result).toMatch(/^19,43\s%$/);
    });

    it('shows the sign of a positive growth rate', () => {
      expect(formatMetric(makeStatisticValue('growth_rate', 3.2), 'growth_rate', formatEs)).toMatch(/^\+3,2\s%$/);
    });

    it('shows the sign of a negative growth rate', () => {
      expect(formatMetric(makeStatisticValue('growth_rate', -3.2), 'growth_rate', formatEs)).toMatch(/^[-−]3,2\s%$/);
    });

    it('shows no sign for a zero growth rate', () => {
      expect(formatMetric(makeStatisticValue('growth_rate', 0), 'growth_rate', formatEs)).toMatch(/^0\s%$/);
    });

    it('returns the text of a text metric', () => {
      const metric = makeStatisticValue('leading_key', null, { valueText: 'ane' });

      expect(formatMetric(metric, 'leading_key', formatEs)).toBe('ane');
    });

    it('returns a dash for a text metric without text', () => {
      const metric = makeStatisticValue('leading_key', null, { valueText: null });

      expect(formatMetric(metric, 'leading_key', formatEs)).toBe('—');
    });

    it.each(['participant_count', 'diversity_percentage', 'shannon_entropy'] as const)(
      'returns a dash for a null numeric value of %s',
      (key) => {
        expect(formatMetric(makeStatisticValue(key, null), key, formatEs)).toBe('—');
      }
    );

    it.each(['participant_count', 'diversity_percentage', 'shannon_entropy'] as const)(
      'returns a dash for an undefined numeric value of %s',
      (key) => {
        const metric = { metricKey: key } as never;

        expect(formatMetric(metric, key, formatEs)).toBe('—');
      }
    );
  });

  describe('formatMetric (en)', () => {
    it('formats an integer with a comma', () => {
      expect(formatMetric(makeStatisticValue('participant_count', 1234), 'participant_count', formatEn)).toBe('1,234');
    });

    it('formats a percentage without a space', () => {
      expect(formatMetric(makeStatisticValue('diversity_percentage', 19.43), 'diversity_percentage', formatEn)).toBe('19.43%');
    });
  });
});
