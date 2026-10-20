import { createFormatter, createTranslator } from 'next-intl';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OverviewCard } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/OverviewCard';
import type { OverviewStatistic } from '@/app/types/api/statistics.types';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Statistics.overview' });
const format = createFormatter({ locale: 'es' });
const count = (value: number) => format.number(value, { useGrouping: 'always' });
const pct = (value: number, signed = false) =>
  format.number(value / 100, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(signed && { signDisplay: 'exceptZero' as const }),
  });
const item = (category: OverviewStatistic['category'], metricKey: string, valueNumeric: number): OverviewStatistic =>
  ({ category, metricKey, valueNumeric });

// Formatted strings contain NBSP, which getByText normalizes in the node but not in the matcher.
const cell = (text: string) =>
  screen.getByText((_content, element) => element?.tagName === 'SPAN' && element.children.length === 0 && element.textContent === text);

function scenario(growth = 2.91): OverviewStatistic[] {
  return [
    item('totalParticipants', 'participant_count', 1234),
    item('participantsGrowthRate', 'growth_rate', growth),
    item('namesDiversity', 'distinct_count', 200),
    item('namesDiversity', 'diversity_percentage', 12.34),
    item('surnamesDiversity', 'distinct_count', 300),
    item('surnamesDiversity', 'diversity_percentage', 8.5),
    item('participantsWithMultipleNames', 'participants_with_multiple_names', 50),
    item('participantsWithMultipleNames', 'multiple_names_rate', 4.5),
  ];
}

describe('OverviewCard', () => {
  it('renders a region labelled by its title heading', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={scenario()} />);

    const region = screen.getByRole('region', { name: 'Resumen · 2024' });
    const heading = within(region).getByRole('heading', { level: 2 });

    expect(heading).toHaveAttribute('id', 'overview-title');
    expect(heading).toHaveTextContent(t('title', { period: '2024' }));
  });

  it('renders every metric label, value and secondary line', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={scenario()} />);

    const previous = Math.round(1234 / (1 + 2.91 / 100));

    expect(screen.getByText(m.Statistics.overview.participants)).toBeInTheDocument();
    expect(screen.getByText('1.234')).toBeInTheDocument();
    expect(cell(t('participantsSub', { period: '2024' }))).toBeInTheDocument();
    expect(screen.getByText(m.Statistics.overview.growth)).toBeInTheDocument();
    expect(cell(pct(2.91, true))).toBeInTheDocument();
    expect(cell(t('growthSub', { previous: count(previous), current: count(1234) }))).toBeInTheDocument();
    expect(screen.getByText(m.Statistics.overview.distinctNames)).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(cell(t('diversitySub', { percentage: pct(12.34) }))).toBeInTheDocument();
    expect(screen.getByText(m.Statistics.overview.distinctSurnames)).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(cell(t('diversitySub', { percentage: pct(8.5) }))).toBeInTheDocument();
    expect(screen.getByText(m.Statistics.overview.multipleNames)).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(cell(t('multipleNamesSub', { percentage: pct(4.5) }))).toBeInTheDocument();
  });

  it('colors a positive growth rate as success', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={scenario(2.91)} />);

    expect(cell(pct(2.91, true))).toHaveClass('text-text-success');
  });

  it('colors a negative growth rate as danger', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={scenario(-3.5)} />);

    expect(cell(pct(-3.5, true))).toHaveClass('text-text-danger');
  });

  it('gives the participants metric the full mobile width', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={scenario()} />);

    const participantsCell = screen.getByText(m.Statistics.overview.participants).parentElement;
    const growthCell = screen.getByText(m.Statistics.overview.growth).parentElement;

    expect(participantsCell).toHaveClass('col-span-2');
    expect(growthCell).not.toHaveClass('col-span-2');
  });

  it('renders only the title bar for an empty overview', () => {
    renderWithIntl(<OverviewCard periodData={makeStatisticsMeta()} overview={[]} />);

    const region = screen.getByRole('region', { name: 'Resumen · 2024' });

    expect(region.children).toHaveLength(1);
    expect(region).toHaveTextContent(t('title', { period: '2024' }));
  });
});
