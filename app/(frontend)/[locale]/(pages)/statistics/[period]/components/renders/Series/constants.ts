/** Below this width (px) of the chart container the chart switches to its compact, phone layout. */
export const COMPACT_BREAKPOINT = 560;
/** Narrowest width the compact layout is drawn at, so the plot never collapses. */
export const COMPACT_MIN_WIDTH = 240;

/** Theme-aware colors (see `--chart-*` in globals.css): the light theme needs darker lines. */
export const COLORS = Array.from({ length: 10 }, (_, index) => `var(--chart-${index + 1})`);
