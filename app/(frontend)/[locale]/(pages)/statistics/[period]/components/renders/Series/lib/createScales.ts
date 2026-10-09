import { HEIGHT, MIN_LABEL_SPACING, PADDING, WIDTH } from '../constants';
import type { Dimension, Line, Scales } from '../types';
import { niceTicks } from './niceTicks';

/** Maps editions and values to viewBox coordinates for the lines that are currently visible. */
export function createScales(dimensions: Dimension[], lines: Line[]): Scales {
  const values = lines.flatMap((line) => [...line.values.values()]);
  // The scale always includes 0 (a series of negative rates still needs its zero line).
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values));

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const firstOrder = dimensions[0]?.order ?? 0;
  const orderSpan = (dimensions[dimensions.length - 1]?.order ?? 0) - firstOrder || 1;
  const scaleMin = ticks[0];
  const scaleSpan = ticks[ticks.length - 1] - scaleMin || 1;

  // The x axis follows the real distance between editions, so a missing one leaves a visible gap.
  const positions = dimensions.map(
    (dimension) => PADDING.left + ((dimension.order - firstOrder) / orderSpan) * plotWidth
  );
  const y = (value: number) => PADDING.top + (1 - (value - scaleMin) / scaleSpan) * plotHeight;

  return {
    positions,
    y,
    ticks,
    // Areas close on the zero line, so a series that goes negative fills towards 0, not the floor.
    baseY: y(0),
    labelStep: labelStepFor(positions),
  };
}

/** Show fewer labels as editions pile up; sized by the closest pair so gaps cannot cause overlaps. */
function labelStepFor(positions: number[]): number {
  const gaps = positions.slice(1).map((position, index) => position - positions[index]);
  const closest = Math.min(...gaps, WIDTH);

  return Math.max(1, Math.ceil(MIN_LABEL_SPACING / closest));
}
