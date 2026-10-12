import { COMPACT_BREAKPOINT, COMPACT_MIN_WIDTH } from '../constants';
import type { ChartLayout } from '../types';

/**
 * Desktop keeps a fixed 640x280 viewBox that scales to the container, as it always did. A busy
 * series is cut to its leading lines so the chart stays readable.
 */
const DESKTOP_LAYOUT: ChartLayout = {
  compact: false,
  width: 640,
  height: 280,
  padding: { top: 28, right: 24, bottom: 30, left: 46 },
  maxLines: 10,
  targetTicks: 4,
  minLabelSpacing: 48,
  axisFontSize: 9,
};

/** Phone layout: drawn at the real container width (1 unit = 1px) so text and strokes keep their size. */
const COMPACT_LAYOUT: Omit<ChartLayout, 'width'> = {
  compact: true,
  height: 220,
  padding: { top: 16, right: 12, bottom: 28, left: 36 },
  maxLines: 4,
  targetTicks: 3,
  minLabelSpacing: 44,
  axisFontSize: 10,
};

/** Layout for a container `containerWidth` px wide. */
export function chartLayout(containerWidth: number): ChartLayout {
  if (containerWidth >= COMPACT_BREAKPOINT) {
    return DESKTOP_LAYOUT;
  }

  return { ...COMPACT_LAYOUT, width: Math.max(containerWidth, COMPACT_MIN_WIDTH) };
}

/** Layout used on the server and on the first client render, before the container is measured. */
export const DEFAULT_LAYOUT = DESKTOP_LAYOUT;
