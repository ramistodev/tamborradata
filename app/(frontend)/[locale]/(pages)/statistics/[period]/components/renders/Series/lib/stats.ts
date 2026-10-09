import type { Dimension, Line } from '../types';

export type PointStat = { index: number; dimensionKey: string; value: number };

export type LineStats = {
  latest: PointStat;
  peak: PointStat;
  /** Relative change of the latest value against the one before it; `null` when there is none. */
  change: number | null;
};

export type TooltipEntry = { line: Line; value: number; change: number | null };

/** Latest value, peak and last change of a line. */
export function lineStats(line: Line, dimensions: Dimension[]): LineStats | null {
  const points = dimensions.flatMap((dimension, index): PointStat[] => {
    const value = line.values.get(dimension.key);
    return value === undefined ? [] : [{ index, dimensionKey: dimension.key, value }];
  });

  if (points.length === 0) {
    return null;
  }

  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  const peak = points.reduce((best, point) => (point.value > best.value ? point : best));

  return {
    latest,
    peak,
    change: previous ? relativeChange(previous.value, latest.value) : null,
  };
}

/** What every line holds in one edition, biggest first, with its change since its previous value. */
export function tooltipEntries(
  lines: Line[],
  dimensions: Dimension[],
  index: number
): TooltipEntry[] {
  const key = dimensions[index].key;

  return lines
    .flatMap((line): TooltipEntry[] => {
      const value = line.values.get(key);
      return value === undefined
        ? []
        : [{ line, value, change: changeSincePrevious(line, dimensions, index, value) }];
    })
    .sort((a, b) => b.value - a.value);
}

function changeSincePrevious(
  line: Line,
  dimensions: Dimension[],
  index: number,
  value: number
): number | null {
  for (let i = index - 1; i >= 0; i--) {
    const previous = line.values.get(dimensions[i].key);

    if (previous !== undefined) {
      return relativeChange(previous, value);
    }
  }

  return null;
}

function relativeChange(previous: number, current: number): number | null {
  // Only meaningful over a positive base: a change over 0 or a negative value (a rate) is not.
  return previous > 0 ? (current - previous) / previous : null;
}
