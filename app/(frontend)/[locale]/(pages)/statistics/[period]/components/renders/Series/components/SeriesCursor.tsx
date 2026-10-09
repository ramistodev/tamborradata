import { HEIGHT, PADDING } from '../constants';
import type { Dimension, Line, Scales } from '../types';

type SeriesCursorProps = {
  index: number;
  lines: Line[];
  dimensions: Dimension[];
  scales: Scales;
};

/** Vertical guide at the hovered edition with a glowing dot on every line that has a value there. */
export function SeriesCursor({ index, lines, dimensions, scales }: SeriesCursorProps) {
  const x = scales.positions[index];
  const key = dimensions[index].key;

  return (
    <>
      <line
        x1={x}
        x2={x}
        y1={PADDING.top}
        y2={HEIGHT - PADDING.bottom}
        stroke="var(--border-strong)"
        strokeDasharray="3 4"
      />
      {lines.map((line) => {
        const value = line.values.get(key);

        return value === undefined ? null : (
          <g key={line.key}>
            <circle cx={x} cy={scales.y(value)} r={8} fill={line.color} opacity={0.18} />
            <circle
              cx={x}
              cy={scales.y(value)}
              r={4}
              fill={line.color}
              stroke="var(--card-bg)"
              strokeWidth={1.75}
            />
          </g>
        );
      })}
    </>
  );
}
