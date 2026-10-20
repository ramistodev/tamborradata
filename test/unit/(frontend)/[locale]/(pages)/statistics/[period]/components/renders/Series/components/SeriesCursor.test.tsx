import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesCursor } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesCursor';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import { createScales } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/createScales';
import { makeSeriesPoint } from '@/test/fixtures/statistics';

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

function renderCursor(index: number) {
  return render(
    <svg>
      <SeriesCursor index={index} lines={chart.lines} dimensions={chart.dimensions} scales={scales} layout={layout} />
    </svg>,
  );
}

describe('SeriesCursor', () => {
  it('draws a vertical guide at the position of the hovered edition', () => {
    const { container } = renderCursor(2);

    const guide = container.querySelector('line');

    expect(container.querySelectorAll('line')).toHaveLength(1);
    expect(guide).toHaveAttribute('x1', String(scales.positions[2]));
    expect(guide).toHaveAttribute('x2', String(scales.positions[2]));
    expect(guide).toHaveAttribute('y1', String(layout.padding.top));
    expect(guide).toHaveAttribute('y2', String(layout.height - layout.padding.bottom));
  });

  it('draws a halo and a dot for every line with a value in that edition', () => {
    const { container } = renderCursor(2);

    const radii = [...container.querySelectorAll('circle')].map((circle) => circle.getAttribute('r'));

    expect(radii).toEqual(['8', '4', '8', '4']);
  });

  it('places the dots on the value of each line', () => {
    const { container } = renderCursor(2);

    const dots = [...container.querySelectorAll('circle[r="4"]')].map((circle) => circle.getAttribute('cy')).sort();
    const expected = chart.lines.map((line) => String(scales.y(line.values.get('2024') as number))).sort();

    expect(dots).toEqual(expected);
  });

  it('skips lines without a value in that edition', () => {
    const { container } = renderCursor(0);

    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
