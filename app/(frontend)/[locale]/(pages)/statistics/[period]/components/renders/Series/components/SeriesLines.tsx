import { areaPath, monotonePath, segmentsOf } from '../lib/paths';
import type { Dimension, Line, Scales } from '../types';

type SeriesLinesProps = {
  /** Prefix that keeps the gradient ids of this chart apart from any other chart on the page. */
  uid: string;
  lines: Line[];
  dimensions: Dimension[];
  scales: Scales;
  /** Line highlighted from the legend; the others fade. */
  focusedKey: string | null;
};

/** Smooth lines that draw themselves in, with a soft gradient under the lead one. */
export function SeriesLines({ uid, lines, dimensions, scales, focusedKey }: SeriesLinesProps) {
  const fillsArea = (line: Line) => lines.length === 1 || focusedKey === line.key;

  return (
    <>
      <defs>
        {lines.map((line, index) => (
          <linearGradient key={line.key} id={`${uid}-area-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={line.color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={line.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {lines.map((line, index) => {
        const segments = segmentsOf(line, dimensions, scales);
        const isDimmed = focusedKey !== null && focusedKey !== line.key;

        return (
          <g
            key={line.key}
            className="transition-opacity duration-200"
            style={{ opacity: isDimmed ? 0.16 : 1 }}
          >
            {fillsArea(line) &&
              segments.map(
                (segment, segmentIndex) =>
                  segment.length > 1 && (
                    <path
                      key={`area-${segmentIndex}`}
                      className="series-area"
                      d={areaPath(segment, scales.baseY)}
                      fill={`url(#${uid}-area-${index})`}
                    />
                  )
              )}
            {segments.map((segment, segmentIndex) =>
              segment.length === 1 ? (
                <circle
                  key={`dot-${segmentIndex}`}
                  cx={segment[0].x}
                  cy={segment[0].y}
                  r={3}
                  fill={line.color}
                />
              ) : (
                <path
                  key={`line-${segmentIndex}`}
                  className="series-draw"
                  d={monotonePath(segment)}
                  pathLength={1}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            )}
          </g>
        );
      })}
    </>
  );
}
