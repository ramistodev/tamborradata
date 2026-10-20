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

  it('renders the latest and the peak as terms of a description list in that order', () => {
    const { container } = renderWithIntl(<SeriesSummary line={lineA} dimensions={chart.dimensions} />);

    const terms = [...container.querySelectorAll('dt')].map((term) => term.textContent);

    expect(terms).toEqual([m.seriesLatest, m.seriesPeak]);
  });

  it('renders nothing for a line without values', () => {
    const empty: Line = { key: 'z', label: 'Z', color: 'red', values: new Map() };
    const { container } = renderWithIntl(<SeriesSummary line={empty} dimensions={chart.dimensions} />);

    expect(container).toBeEmptyDOMElement();
  });
});
