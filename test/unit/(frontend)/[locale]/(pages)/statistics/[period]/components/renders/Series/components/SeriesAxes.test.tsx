import { describe, expect, it } from 'vitest';
import { SeriesAxes } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesAxes';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import { createScales } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/createScales';
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
const layout = chartLayout(1000);
const scales = createScales(chart.dimensions, chart.lines, layout);

function renderAxes(props: Partial<Parameters<typeof SeriesAxes>[0]> = {}) {
  return renderWithIntl(
    <svg>
      <SeriesAxes dimensions={chart.dimensions} scales={scales} layout={layout} {...props} />
    </svg>,
  );
}

describe('SeriesAxes', () => {
  it('draws one grid line per tick', () => {
    const { container } = renderAxes();

    expect(container.querySelectorAll('line')).toHaveLength(scales.ticks.length);
  });

  it('draws the zero line solid and the others dashed', () => {
    const { container } = renderAxes();

    const lines = [...container.querySelectorAll('line')];

    scales.ticks.forEach((tick, index) => {
      if (tick === 0) {
        expect(lines[index]).not.toHaveAttribute('stroke-dasharray');
      } else {
        expect(lines[index]).toHaveAttribute('stroke-dasharray', '2 5');
      }
    });
  });

  it('labels the y axis with compact numbers', () => {
    const { container } = renderAxes();

    const labels = [...container.querySelectorAll('text[text-anchor="end"]')].map((text) => text.textContent);

    expect(labels).toEqual(['0', '10', '20', '30']);
  });

  it('labels every edition when there is room for all of them', () => {
    const { container } = renderAxes();

    const labels = [...container.querySelectorAll('text[text-anchor="middle"]')].map((text) => text.textContent);

    expect(scales.labelStep).toBe(1);
    expect(labels).toEqual(['2022', '2023', '2024']);
  });

  it('labels one edition out of two, ending on the latest, when the label step is 2', () => {
    const dimensions = Array.from({ length: 5 }, (_, index) => ({ key: `d${index}`, order: index }));
    const positions = dimensions.map((_, index) => 46 + index * 100);
    const { container } = renderAxes({ dimensions, scales: { ...scales, positions, labelStep: 2 } });

    const labels = [...container.querySelectorAll('text[text-anchor="middle"]')].map((text) => text.textContent);

    expect(labels).toEqual(['d0', 'd2', 'd4']);
  });
});
