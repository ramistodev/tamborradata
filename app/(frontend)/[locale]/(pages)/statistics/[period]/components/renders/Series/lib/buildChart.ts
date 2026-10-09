import type { StatisticSeriesPoint } from '../../../../../../../../../types/api/statistics.types';
import { COLORS, MAX_LINES } from '../constants';
import type { Chart, Dimension, Line } from '../types';

type UncoloredLine = Omit<Line, 'color'>;

/**
 * Groups the points of a series into lines (one per entity) and the editions they span. A line
 * with no entity of its own (a single metric over time) is named `fallbackLabel`.
 */
export function buildChart(data: StatisticSeriesPoint[], fallbackLabel: string): Chart {
  const orderByDimension = new Map<string, number>();
  const linesByKey = new Map<string, UncoloredLine>();

  for (const point of data) {
    if (!orderByDimension.has(point.dimensionKey)) {
      orderByDimension.set(point.dimensionKey, point.dimensionOrder ?? orderByDimension.size);
    }
    if (point.value === undefined) {
      continue;
    }

    const key = point.entityKey ?? point.school?.schoolId ?? point.entityLabel ?? point.metricKey;
    const line = linesByKey.get(key) ?? {
      key,
      label: point.entityLabel ?? point.school?.canonicalName ?? fallbackLabel,
      values: new Map<string, number>(),
    };
    line.values.set(point.dimensionKey, point.value);
    linesByKey.set(key, line);
  }

  const lines = leadingLines([...linesByKey.values()], orderByDimension).map((line, index) => ({
    ...line,
    color: COLORS[index % COLORS.length],
  }));
  const dimensions: Dimension[] = [...orderByDimension.entries()]
    .map(([key, order]) => ({ key, order }))
    .sort((a, b) => a.order - b.order);

  return { dimensions, lines };
}

/** The leading lines are the ones with the highest value in the latest edition they appear in. */
function leadingLines(
  lines: UncoloredLine[],
  orderByDimension: Map<string, number>
): UncoloredLine[] {
  const latestValue = (line: UncoloredLine) => {
    let latest = { order: -Infinity, value: 0 };

    for (const [dimension, value] of line.values) {
      const order = orderByDimension.get(dimension) ?? -Infinity;
      if (order > latest.order) {
        latest = { order, value };
      }
    }

    return latest.value;
  };

  return lines.sort((a, b) => latestValue(b) - latestValue(a)).slice(0, MAX_LINES);
}
