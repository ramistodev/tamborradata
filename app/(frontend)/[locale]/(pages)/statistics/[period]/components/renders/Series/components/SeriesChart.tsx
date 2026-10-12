import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import type { StatisticSeriesPoint } from '../../../../../../../../../types/api/statistics.types';
import { CHART_STYLES } from '../chartStyles';
import { useChartHover } from '../hooks/useChartHover';
import { useChartLayout } from '../hooks/useChartLayout';
import { useSeriesChart } from '../hooks/useSeriesChart';
import { tooltipEntries } from '../lib/stats';
import { SeriesAxes } from './SeriesAxes';
import { SeriesCursor } from './SeriesCursor';
import { SeriesDataTable } from './SeriesDataTable';
import { SeriesLegend } from './SeriesLegend';
import { SeriesLines } from './SeriesLines';
import { SeriesMarkers } from './SeriesMarkers';
import { SeriesSummary } from './SeriesSummary';
import { SeriesTooltip } from './SeriesTooltip';

type SeriesChartProps = { label: string; data: StatisticSeriesPoint[] };

/**
 * Multi-line chart of one series: key figures, the plot, a shared tooltip and an interactive legend.
 * On a narrow container it switches to a compact layout (fewer lines, no hover) drawn at real size.
 */
export function SeriesChart({ label, data }: SeriesChartProps) {
  const uid = useId().replace(/:/g, '');
  const t = useTranslations('Statistics.layout');
  const format = useNumberFormatter();
  const { ref, layout } = useChartLayout();
  const { chart, visibleLines, scales, hiddenKeys, toggleLine, focusedKey, setFocusedKey } =
    useSeriesChart(data, label, layout);
  const { hovered, handlers } = useChartHover(scales.positions, layout.width, !layout.compact);
  const { dimensions, lines } = chart;

  if (dimensions.length < 2 || lines.length === 0) {
    return null;
  }

  const hasSingleLine = lines.length === 1;
  const hintId = `${uid}-hint`;
  // What the tooltip shows, as text for screen readers (the tooltip itself is visual only).
  const announcement =
    hovered === null
      ? ''
      : `${dimensions[hovered].key}: ${tooltipEntries(visibleLines, dimensions, hovered)
          .map(({ line, value }) => `${line.label} ${format.format(value)}`)
          .join(', ')}`;

  return (
    <figure className="flex min-w-0 flex-col gap-4">
      {/* `href` + `precedence`: React emits the stylesheet once, however many charts are on the page. */}
      <style href="series-chart" precedence="default">
        {CHART_STYLES}
      </style>
      {hasSingleLine && <SeriesSummary line={lines[0]} dimensions={dimensions} />}
      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label={label}
        aria-describedby={hintId}
        className="relative touch-pan-y rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        {...handlers}
      >
        <p id={hintId} className="sr-only">
          {t('chartHint')}
        </p>
        <p role="status" className="sr-only">
          {announcement}
        </p>
        {/* Decorative: the numbers reach screen readers through the table below. */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="block w-full overflow-hidden"
        >
          <SeriesAxes dimensions={dimensions} scales={scales} layout={layout} />
          <SeriesLines
            uid={uid}
            lines={visibleLines}
            dimensions={dimensions}
            scales={scales}
            focusedKey={focusedKey}
          />
          {visibleLines.length === 1 && hovered === null && (
            <SeriesMarkers
              line={visibleLines[0]}
              dimensions={dimensions}
              scales={scales}
              layout={layout}
            />
          )}
          {hovered !== null && (
            <SeriesCursor
              index={hovered}
              lines={visibleLines}
              dimensions={dimensions}
              scales={scales}
              layout={layout}
            />
          )}
        </svg>
        {hovered !== null && (
          <SeriesTooltip
            dimensionKey={dimensions[hovered].key}
            x={scales.positions[hovered]}
            width={layout.width}
            entries={tooltipEntries(visibleLines, dimensions, hovered)}
          />
        )}
      </div>
      <SeriesDataTable caption={label} dimensions={dimensions} lines={lines} />
      {!hasSingleLine && (
        <SeriesLegend
          lines={lines}
          dimensions={dimensions}
          hiddenKeys={hiddenKeys}
          showLatest={layout.compact}
          onToggle={toggleLine}
          onFocus={setFocusedKey}
        />
      )}
    </figure>
  );
}
