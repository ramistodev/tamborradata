import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import { WIDTH } from '../constants';
import { lineStats, type PointStat } from '../lib/stats';
import type { Dimension, Line, Scales } from '../types';

type SeriesMarkersProps = { line: Line; dimensions: Dimension[]; scales: Scales };

const HALO = {
  paintOrder: 'stroke',
  stroke: 'var(--card-bg)',
  strokeWidth: 4,
  strokeLinejoin: 'round',
} as const;

/** Marks the latest value (a pulsing dot) and the peak of a lone line, each with its number. */
export function SeriesMarkers({ line, dimensions, scales }: SeriesMarkersProps) {
  const format = useNumberFormatter();
  const stats = lineStats(line, dimensions);

  if (!stats) {
    return null;
  }

  const { latest, peak } = stats;
  const place = (point: PointStat) => ({
    x: scales.positions[point.index],
    y: scales.y(point.value),
  });
  const last = place(latest);
  const top = place(peak);

  return (
    <>
      {peak.index !== latest.index && (
        <g>
          <circle cx={top.x} cy={top.y} r={5} fill="none" stroke={line.color} strokeWidth={1.5} />
          <circle cx={top.x} cy={top.y} r={2.2} fill={line.color} />
          <text
            x={top.x}
            y={top.y - 11}
            textAnchor={anchorFor(top.x)}
            fontSize={10}
            fontWeight={700}
            fill="var(--text)"
            fontFamily="var(--ff-mono)"
            {...HALO}
          >
            {format.format(peak.value)}
          </text>
        </g>
      )}
      <g>
        <circle className="series-pulse" cx={last.x} cy={last.y} r={4.5} fill={line.color} />
        <circle
          cx={last.x}
          cy={last.y}
          r={4.5}
          fill={line.color}
          stroke="var(--card-bg)"
          strokeWidth={2}
        />
        <text
          x={last.x}
          y={last.y - 11}
          textAnchor={anchorFor(last.x)}
          fontSize={10}
          fontWeight={700}
          fill={line.color}
          fontFamily="var(--ff-mono)"
          {...HALO}
        >
          {format.format(latest.value)}
        </text>
      </g>
    </>
  );
}

/** Keeps a label inside the chart when its point is close to an edge. */
function anchorFor(x: number): 'start' | 'middle' | 'end' {
  if (x < 56) return 'start';
  if (x > WIDTH - 56) return 'end';
  return 'middle';
}
