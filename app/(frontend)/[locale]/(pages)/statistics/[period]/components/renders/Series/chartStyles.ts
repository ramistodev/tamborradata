/**
 * Animations of the chart. They are CSS (not JS) so they also run on the server-rendered HTML, and
 * they are switched off for users who ask for reduced motion.
 */
export const CHART_STYLES = `
@keyframes series-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes series-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes series-pulse { from { transform: scale(1); opacity: 0.55 } to { transform: scale(2.8); opacity: 0 } }
.series-draw { stroke-dasharray: 1; animation: series-draw 1.2s cubic-bezier(0.22, 1, 0.36, 1) both }
.series-area { animation: series-fade 1.4s ease-out both }
.series-pulse { transform-box: fill-box; transform-origin: center; animation: series-pulse 2s ease-out infinite }
@media (prefers-reduced-motion: reduce) {
  .series-draw { animation: none; stroke-dasharray: none }
  .series-area, .series-pulse { animation: none }
}
`;
