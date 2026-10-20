import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { useOverviewCard } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/hooks/useOverviewCard';
import type { OverviewStatistic } from '@/app/types/api/statistics.types';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderHookWithIntl } from '@/test/helpers/renderWithIntl';

const t = createTranslator({ locale: 'es', messages: messagesByLocale.es, namespace: 'Statistics.overview' });
const format = createFormatter({ locale: 'es' });
const count = (value: number) => format.number(value, { useGrouping: 'always' });
const pct = (value: number, signed = false) => format.number(value / 100, {
  style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2,
  ...(signed && { signDisplay: 'exceptZero' as const }),
});
const item = (category: OverviewStatistic['category'], metricKey: string, valueNumeric: number): OverviewStatistic =>
  ({ category, metricKey, valueNumeric });

const overview = [
  item('totalParticipants', 'participant_count', 1234),
  item('participantsGrowthRate', 'growth_rate', 2.91),
  item('participationRecordYears', 'record_participant_count', 1500),
  item('participationRecordYears', 'record_year', 2019),
  item('namesDiversity', 'distinct_count', 200),
  item('namesDiversity', 'diversity_percentage', 12.34),
  item('surnamesDiversity', 'distinct_count', 300),
  item('surnamesDiversity', 'diversity_percentage', 8.5),
  item('participantsWithMultipleNames', 'participants_with_multiple_names', 50),
  item('participantsWithMultipleNames', 'multiple_names_rate', 4.5),
];

function renderOverview(values = overview, periodData = makeStatisticsMeta()) {
  return renderHookWithIntl(() => useOverviewCard({ periodData, overview: values }), { locale: 'es' });
}

describe('useOverviewCard', () => {
  it('builds exact year headline and diversity rows', () => {
    const { result } = renderOverview();
    expect(result.current.title).toBe('Resumen · 2024');
    expect(result.current.rows).toEqual([
      [
        {
          label: 'Participantes', value: '1.234', secondary: t('participantsSub', { period: '2024' }),
          size: 'hero', tone: 'accent', fullWidthOnMobile: true,
        },
        {
          label: 'Variación vs. edición anterior', value: pct(2.91, true),
          secondary: t('growthSub', {
            previous: count(Math.round(1234 / (1 + 2.91 / 100))), current: count(1234),
          }),
          size: 'large', tone: 'positive',
        },
      ],
      [
        { label: 'Nombres distintos', value: count(200), secondary: t('diversitySub', { percentage: pct(12.34) }) },
        { label: 'Apellidos distintos', value: count(300), secondary: t('diversitySub', { percentage: pct(8.5) }) },
        { label: 'Nombres compuestos', value: count(50), secondary: t('multipleNamesSub', { percentage: pct(4.5) }) },
      ],
    ]);
  });

  it('uses the record metric for a global period', () => {
    const periodData = makeStatisticsMeta({ period: 'global', periodKind: 'global' });
    const { result } = renderOverview(overview, periodData);
    expect(result.current.rows[0]).toEqual([
      {
        label: 'Participantes', value: count(1234), secondary: t('participantsGlobalSub'),
        size: 'hero', tone: 'accent', fullWidthOnMobile: true,
      },
      { label: 'Récord histórico', value: count(1500), secondary: t('recordSub', { year: 2019 }), size: 'large' },
    ]);
    const withoutYear = overview.filter((metric) => metric.metricKey !== 'record_year');
    const missing = renderOverview(withoutYear, periodData);
    expect(missing.result.current.rows[0][1]).toEqual({
      label: 'Récord histórico', value: count(1500), secondary: undefined, size: 'large',
    });
  });

  it.each([[-1, 'negative'], [0, 'default']] as const)('assigns %s growth the %s tone', (growth, tone) => {
    const values = overview.map((metric) => metric.metricKey === 'growth_rate' ? { ...metric, valueNumeric: growth } : metric);
    const { result } = renderOverview(values);
    expect(result.current.rows[0][1]?.tone).toBe(tone);
  });

  it('omits growth when it or participants are missing', () => {
    const noGrowth = renderOverview(overview.filter((metric) => metric.metricKey !== 'growth_rate'));
    expect(noGrowth.result.current.rows[0]).toHaveLength(1);
    const noParticipants = renderOverview(overview.filter((metric) => metric.metricKey !== 'participant_count'));
    expect(noParticipants.result.current.rows[0][0]?.label).toBe('Nombres distintos');
  });

  it('omits absent metrics and secondary percentages precisely', () => {
    const values = [item('namesDiversity', 'distinct_count', 200)];
    const { result } = renderOverview(values);
    expect(result.current.rows).toEqual([[{
      label: 'Nombres distintos', value: count(200), secondary: undefined,
    }]]);
    const percentageOnly = renderOverview([item('namesDiversity', 'diversity_percentage', 12.34)]);
    expect(percentageOnly.result.current.rows).toEqual([]);
    const empty = renderOverview([]);
    expect(empty.result.current.rows).toEqual([]);
    expect(empty.result.current.title).toBe('Resumen · 2024');
  });
});
