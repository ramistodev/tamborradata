import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesSummary } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesSummary';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import type { Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';
import { makeSeriesPoint } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Statistics.layout;
const point = (entity: 'a' | 'b', year: number, value: number) =>
  makeSeriesPoint({
    entityKey: entity,
    entityLabel: `Line ${entity.toUpperCase()}`,
    dimensionKey: String(year),
    dimensionOrder: year,
    value,
  });
const data = [point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 15), point('b', 2023, 5), point('b', 2024, 30)];
const chart = buildChart(data, 'Fallback', 10);
const lineA = chart.lines.find((line) => line.key === 'a') as Line;

describe('SeriesSummary', () => {
  it('shows the latest value with its edition as hint', () => {
    renderWithIntl(<SeriesSummary line={lineA} dimensions={chart.dimensions} />);

    const value = screen.getByText(m.seriesLatest).closest('div') as HTMLElement;

    expect(value).toHaveTextContent('15');
    expect(value).toHaveTextContent('2024');
  });

  it('shows the peak value with its edition as hint', () => {
    renderWithIntl(<SeriesSummary line={lineA} dimensions={chart.dimensions} />);

    const value = screen.getByText(m.seriesPeak).closest('div') as HTMLElement;

    expect(value).toHaveTextContent('20');
    expect(value).toHaveTextContent('2023');
  });

  it('puts the earlier edition first, so the peak comes before the latest when it is older', () => {
    const { container } = renderWithIntl(<SeriesSummary line={lineA} dimensions={chart.dimensions} />);

    const terms = [...container.querySelectorAll('dt')].map((term) => term.textContent);

    expect(terms).toEqual([m.seriesPeak, m.seriesLatest]);
  });

  it('keeps the latest first when the peak is the latest edition', () => {
    const lineB = chart.lines.find((line) => line.key === 'b') as Line;
    const { container } = renderWithIntl(<SeriesSummary line={lineB} dimensions={chart.dimensions} />);

    const terms = [...container.querySelectorAll('dt')].map((term) => term.textContent);

    expect(terms).toEqual([m.seriesLatest, m.seriesPeak]);
  });

  it('right-aligns only the last figure', () => {
    const { container } = renderWithIntl(<SeriesSummary line={lineA} dimensions={chart.dimensions} />);

    const [first, second] = [...container.querySelectorAll('dl > div')];

    expect(first).not.toHaveClass('items-end');
    expect(second).toHaveClass('items-end');
  });

  it('renders nothing for a line without values', () => {
    const empty: Line = { key: 'z', label: 'Z', color: 'red', values: new Map() };
    const { container } = renderWithIntl(<SeriesSummary line={empty} dimensions={chart.dimensions} />);

    expect(container).toBeEmptyDOMElement();
  });
});
