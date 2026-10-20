import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesDataTable } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesDataTable';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { makeSeriesPoint } from '@/test/fixtures/statistics';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

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

function renderTable(caption = 'Trends') {
  return renderWithIntl(<SeriesDataTable caption={caption} dimensions={chart.dimensions} lines={chart.lines} />);
}

describe('SeriesDataTable', () => {
  it('is visually hidden', () => {
    const { container } = renderTable();

    expect(container.firstElementChild).toHaveClass('sr-only');
  });

  it('uses the caption as the table name', () => {
    renderTable('Trends');

    expect(screen.getByRole('table', { name: 'Trends' })).toBeInTheDocument();
  });

  it('has a column header per line, in line order', () => {
    renderTable();

    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);

    expect(headers).toEqual(chart.lines.map((line) => line.label));
  });

  it('has one row per edition with the key as row header', () => {
    renderTable();

    expect(screen.getAllByRole('rowheader').map((header) => header.textContent)).toEqual(['2022', '2023', '2024']);
  });

  it('formats the values and shows a dash where a line has none', () => {
    renderTable();

    const rows = screen.getAllByRole('row').slice(1);
    const cellsOf = (row: HTMLElement) => within(row).getAllByRole('cell').map((cell) => cell.textContent);
    const labels = chart.lines.map((line) => line.key);
    const byLine = (row: HTMLElement) => Object.fromEntries(labels.map((key, index) => [key, cellsOf(row)[index]]));

    expect(byLine(rows[0])).toEqual({ a: '10', b: '—' });
    expect(byLine(rows[1])).toEqual({ a: '20', b: '5' });
    expect(byLine(rows[2])).toEqual({ a: '15', b: '30' });
  });

  it('formats thousands with the locale separator', () => {
    const big = buildChart([point('a', 2022, 1234), point('a', 2023, 5)], 'Fallback', 10);
    renderWithIntl(<SeriesDataTable caption="Big" dimensions={big.dimensions} lines={big.lines} />);

    expect(screen.getByRole('cell', { name: '1.234' })).toBeInTheDocument();
  });
});
