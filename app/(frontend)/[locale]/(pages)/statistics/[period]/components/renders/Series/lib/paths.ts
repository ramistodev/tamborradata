import type { Dimension, Line, Point, Scales } from '../types';

/** Splits a line into runs of consecutive editions: an edition without value breaks the line. */
export function segmentsOf(
  line: Line,
  dimensions: Dimension[],
  { positions, y }: Pick<Scales, 'positions' | 'y'>
): Point[][] {
  const segments: Point[][] = [];
  let current: Point[] = [];

  dimensions.forEach((dimension, index) => {
    const value = line.values.get(dimension.key);

    if (value === undefined) {
      if (current.length > 0) {
        segments.push(current);
      }
      current = [];
      return;
    }

    current.push({ x: positions[index], y: y(value) });
  });

  if (current.length > 0) {
    segments.push(current);
  }

  return segments;
}

/**
 * Smooth curve through the points (monotone cubic, Fritsch-Carlson): it never overshoots, so a
 * curve never dips below a low value or rises above a peak that is not in the data.
 */
export function monotonePath(points: Point[]): string {
  if (points.length === 0) {
    return '';
  }

  const [first, ...rest] = points;

  if (rest.length === 0) {
    return `M${first.x} ${first.y}`;
  }

  const widths = rest.map((point, i) => point.x - points[i].x || 1);
  const slopes = rest.map((point, i) => (point.y - points[i].y) / widths[i]);
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === points.length - 1) return slopes[i - 1];
    return slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2;
  });

  slopes.forEach((slope, i) => {
    if (slope === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      return;
    }

    const a = tangents[i] / slope;
    const b = tangents[i + 1] / slope;
    const magnitude = a * a + b * b;

    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude);
      tangents[i] = scale * a * slope;
      tangents[i + 1] = scale * b * slope;
    }
  });

  const curves = rest.map((point, i) => {
    const from = points[i];
    const third = widths[i] / 3;

    return `C${from.x + third} ${from.y + tangents[i] * third} ${point.x - third} ${
      point.y - tangents[i + 1] * third
    } ${point.x} ${point.y}`;
  });

  return `M${first.x} ${first.y} ${curves.join(' ')}`;
}

/** The same curve closed down to the baseline, to fill the area under it. */
export function areaPath(points: Point[], baseY: number): string {
  const last = points[points.length - 1];

  return `${monotonePath(points)} L${last.x} ${baseY} L${points[0].x} ${baseY} Z`;
}
