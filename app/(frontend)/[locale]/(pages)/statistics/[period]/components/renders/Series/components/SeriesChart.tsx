import { useId } from 'react';
import type { StatisticSeriesPoint } from '../../../../../../../../../types/api/statistics.types';
import { CHART_STYLES } from '../chartStyles';
import { HEIGHT, WIDTH } from '../constants';
import { useChartHover } from '../hooks/useChartHover';
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

/** Multi-line chart of one series: key figures, the plot, a shared tooltip and an interactive legend. */
export function SeriesChart({ label, data }: SeriesChartProps) {
  const uid = useId().replace(/:/g, '');
  const { chart, visibleLines, scales, hiddenKeys, toggleLine, focusedKey, setFocusedKey } =
    useSeriesChart(data, label);
  const { hovered, handlers } = useChartHover(scales.positions);
  const { dimensions, lines } = chart;

  if (dimensions.length < 2 || lines.length === 0) {
    return null;
  }

  const hasSingleLine = lines.length === 1;

  return (
    <div className="flex flex-col gap-4">
      {/* `href` + `precedence`: React emits the stylesheet once, however many charts are on the page. */}
      <style href="series-chart" precedence="default">
        {CHART_STYLES}
      </style>
      {hasSingleLine && <SeriesSummary line={lines[0]} dimensions={dimensions} />}
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={label}
          className="block w-full touch-pan-y overflow-hidden"
          {...handlers}
        >
          <SeriesAxes dimensions={dimensions} scales={scales} />
          <SeriesLines
            uid={uid}
            lines={visibleLines}
            dimensions={dimensions}
            scales={scales}
            focusedKey={focusedKey}
          />
          {visibleLines.length === 1 && hovered === null && (
            <SeriesMarkers line={visibleLines[0]} dimensions={dimensions} scales={scales} />
          )}
          {hovered !== null && (
            <SeriesCursor
              index={hovered}
              lines={visibleLines}
              dimensions={dimensions}
              scales={scales}
            />
          )}
        </svg>
        {hovered !== null && (
          <SeriesTooltip
            dimensionKey={dimensions[hovered].key}
            x={scales.positions[hovered]}
            entries={tooltipEntries(visibleLines, dimensions, hovered)}
          />
        )}
      </div>
      <SeriesDataTable caption={label} dimensions={dimensions} lines={lines} />
      {!hasSingleLine && (
        <SeriesLegend
          lines={lines}
          hiddenKeys={hiddenKeys}
          onToggle={toggleLine}
          onFocus={setFocusedKey}
        />
      )}
    </div>
  );
}
