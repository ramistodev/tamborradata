import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesRender } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series';
import { makeSeriesCategory, makeSeriesPoint } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Statistics.categories;
const point = (entity: 'a' | 'b', year: number, value: number) =>
  makeSeriesPoint({
    entityKey: entity,
    entityLabel: `Line ${entity.toUpperCase()}`,
    dimensionKey: String(year),
    dimensionOrder: year,
    value,
  });

describe('SeriesRender', () => {
  it('names the chart group after the category title', () => {
    const category = makeSeriesCategory('nameTrends', [
      point('a', 2022, 10),
      point('a', 2023, 20),
      point('b', 2022, 5),
      point('b', 2023, 30),
    ]);

    renderWithIntl(<SeriesRender category={category} />);

    expect(screen.getByRole('group', { name: m.nameTrends.title })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: m.nameTrends.title })).toBeInTheDocument();
  });

  it('renders the chart of the category data', () => {
    const category = makeSeriesCategory('nameTrends', [point('a', 2022, 10), point('a', 2023, 20)]);

    const { container } = renderWithIntl(<SeriesRender category={category} />);

    expect(container.querySelectorAll('svg path.series-draw')).toHaveLength(1);
  });
});
