import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesLines } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesLines';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import { createScales } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/createScales';
import { makeSeriesPoint } from '@/test/fixtures/statistics';

const point = (entity: string, year: number, value: number) =>
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

function renderLines(props: Partial<Parameters<typeof SeriesLines>[0]> = {}) {
  return render(
    <svg>
      <SeriesLines
        uid="u"
        lines={chart.lines}
        dimensions={chart.dimensions}
        scales={scales}
        focusedKey={null}
        {...props}
      />
    </svg>,
  );
}

describe('SeriesLines', () => {
  it('draws one path per multi-point segment', () => {
    const { container } = renderLines();

    expect(container.querySelectorAll('path.series-draw')).toHaveLength(2);
  });

  it('starts every line path with a move command', () => {
    const { container } = renderLines();

    container.querySelectorAll('path.series-draw').forEach((path) => {
      expect(path.getAttribute('d')).toMatch(/^M/);
    });
  });

  it('splits a line with a gap into segments and draws a lone point as a dot', () => {
    const gapped = buildChart(
      [point('x', 2021, 1), point('x', 2022, 2), point('x', 2024, 4), point('y', 2023, 3)],
      'Fallback',
      10,
    );
    const gappedScales = createScales(gapped.dimensions, gapped.lines, layout);
    const lineX = gapped.lines.filter((line) => line.key === 'x');

    const { container } = render(
      <svg>
        <SeriesLines uid="u" lines={lineX} dimensions={gapped.dimensions} scales={gappedScales} focusedKey={null} />
      </svg>,
    );

    expect(container.querySelectorAll('path.series-draw')).toHaveLength(1);
    expect(container.querySelectorAll('circle[r="3"]')).toHaveLength(1);
  });

  describe('area under the line', () => {
    it('is not drawn when several lines are visible and none is focused', () => {
      const { container } = renderLines();

      expect(container.querySelectorAll('path.series-area')).toHaveLength(0);
    });

    it('is drawn for a single visible line', () => {
      const { container } = renderLines({ lines: [chart.lines[0]] });

      expect(container.querySelectorAll('path.series-area')).toHaveLength(1);
    });

    it('is drawn only for the focused line', () => {
      const { container } = renderLines({ focusedKey: 'a' });

      const areas = container.querySelectorAll('path.series-area');
      const indexOfA = chart.lines.findIndex((line) => line.key === 'a');

      expect(areas).toHaveLength(1);
      expect(areas[0]).toHaveAttribute('fill', `url(#u-area-${indexOfA})`);
    });
  });

  it('fades the lines that are not focused', () => {
    const { container } = renderLines({ focusedKey: 'a' });

    const opacities = [...container.querySelectorAll('svg > g')].map((group) => (group as SVGGElement).style.opacity);
    const expected = chart.lines.map((line) => (line.key === 'a' ? '1' : '0.16'));

    expect(opacities).toEqual(expected);
  });

  it('keeps every line fully opaque without focus', () => {
    const { container } = renderLines();

    const opacities = [...container.querySelectorAll('svg > g')].map((group) => (group as SVGGElement).style.opacity);

    expect(opacities).toEqual(['1', '1']);
  });

  it('defines one gradient per line with ids derived from the uid', () => {
    const { container } = renderLines();

    const ids = [...container.querySelectorAll('linearGradient')].map((gradient) => gradient.id);

    expect(ids).toEqual(['u-area-0', 'u-area-1']);
  });
});
