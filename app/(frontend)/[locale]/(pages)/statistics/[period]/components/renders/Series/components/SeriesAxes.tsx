import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import { HEIGHT, PADDING, WIDTH } from '../constants';
import type { Dimension, Scales } from '../types';

const AXIS_TEXT_PROPS = {
  fontSize: 9,
  fill: 'var(--text-tertiary)',
  fontFamily: 'var(--ff-mono)',
} as const;

type SeriesAxesProps = { dimensions: Dimension[]; scales: Scales };

/** Horizontal grid with the value labels (y) and the edition labels (x). */
export function SeriesAxes({ dimensions, scales }: SeriesAxesProps) {
  const compact = useNumberFormatter({ notation: 'compact', maximumFractionDigits: 1 });
  const { positions, ticks, y, labelStep } = scales;

  return (
    <>
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="var(--border)"
            strokeDasharray={tick === 0 ? undefined : '2 5'}
            strokeOpacity={tick === 0 ? 1 : 0.7}
          />
          <text x={PADDING.left - 8} y={y(tick) + 3.5} textAnchor="end" {...AXIS_TEXT_PROPS}>
            {compact.format(tick)}
          </text>
        </g>
      ))}
      {dimensions.map(
        (dimension, index) =>
          (dimensions.length - 1 - index) % labelStep === 0 && (
            <text
              key={dimension.key}
              x={positions[index]}
              y={HEIGHT - PADDING.bottom + 17}
              textAnchor="middle"
              {...AXIS_TEXT_PROPS}
            >
              {dimension.key}
            </text>
          )
      )}
    </>
  );
}
