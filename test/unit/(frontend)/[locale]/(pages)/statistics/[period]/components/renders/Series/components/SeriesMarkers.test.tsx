import { describe, expect, it } from 'vitest';
import { SeriesMarkers } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesMarkers';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import { createScales } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/createScales';
import type { Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';
import { makeSeriesPoint } from '@/test/fixtures/statistics';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const point = (entity: string, year: number, value: number) =>
  makeSeriesPoint({
    entityKey: entity,
    entityLabel: `Line ${entity.toUpperCase()}`,
    dimensionKey: String(year),
    dimensionOrder: year,
    value,
  });
const layout = chartLayout(1000);

function setup(points: ReturnType<typeof point>[], lineKey: string) {
  const chart = buildChart(points, 'Fallback', 10);
  const scales = createScales(chart.dimensions, chart.lines, layout);
  const line = chart.lines.find((candidate) => candidate.key === lineKey) as Line;
  const view = renderWithIntl(
    <svg>
      <SeriesMarkers line={line} dimensions={chart.dimensions} scales={scales} layout={layout} />
    </svg>,
  );
  return { ...view, scales, chart };
}

const texts = (container: HTMLElement) => [...container.querySelectorAll('text')];

describe('SeriesMarkers', () => {
  it('marks the latest value with a pulsing dot and its formatted number', () => {
    const { container } = setup([point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 30)], 'a');

    expect(container.querySelectorAll('circle.series-pulse')).toHaveLength(1);
    expect(texts(container).map((text) => text.textContent)).toEqual(['30']);
  });

  it('marks the peak as well when it is not the latest point', () => {
    const { container } = setup([point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 15)], 'a');

    expect(texts(container).map((text) => text.textContent)).toEqual(['20', '15']);
    expect(container.querySelectorAll('circle')).toHaveLength(4);
  });

  it.each([
    ['start', [point('a', 2022, 30), point('a', 2023, 10), point('a', 2024, 5)]],
    ['middle', [point('a', 2022, 10), point('a', 2023, 30), point('a', 2024, 20)]],
    ['end', [point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 30)]],
  ] as const)('anchors the label with %s alignment', (anchor, points) => {
    const { container } = setup([...points], 'a');

    const firstLabel = texts(container)[0];

    expect(firstLabel).toHaveAttribute('text-anchor', anchor);
  });

  it('anchors the latest label at the end near the right edge', () => {
    const { container } = setup([point('a', 2022, 10), point('a', 2023, 30), point('a', 2024, 20)], 'a');

    const latest = texts(container)[1];

    expect(latest.textContent).toBe('20');
    expect(latest).toHaveAttribute('text-anchor', 'end');
  });

  it('renders nothing for a line without values', () => {
    const chart = buildChart([point('a', 2022, 1), point('a', 2023, 2)], 'Fallback', 10);
    const scales = createScales(chart.dimensions, chart.lines, layout);
    const empty: Line = { key: 'z', label: 'Z', color: 'red', values: new Map() };

    const { container } = renderWithIntl(
      <svg>
        <SeriesMarkers line={empty} dimensions={chart.dimensions} scales={scales} layout={layout} />
      </svg>,
    );

    expect(container.querySelector('svg')).toBeEmptyDOMElement();
  });
});
