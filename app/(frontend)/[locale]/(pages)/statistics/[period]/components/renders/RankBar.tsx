import { useNumberFormatter } from '../../../../../../i18n/useNumberFormatter';

const MIN_BAR_WIDTH_PERCENT = 2;

type RankBarProps = {
  value: number;
  maxAbsValue: number;
  isHighlighted: boolean;
  isDiverging: boolean;
};

/** Bar of one ranking row: relative to the leader, or growing from the centre when signed. */
export function RankBar({ value, maxAbsValue, isHighlighted, isDiverging }: RankBarProps) {
  if (isDiverging) {
    return <DivergingBar value={value} maxAbsValue={maxAbsValue} />;
  }

  const width = maxAbsValue > 0 ? Math.max(MIN_BAR_WIDTH_PERCENT, (value / maxAbsValue) * 100) : 0;

  return (
    <div aria-hidden="true" className="h-1 rounded-full bg-bg-hover">
      <div
        className={`h-full rounded-full ${isHighlighted ? 'bg-accent' : 'bg-accent-dim opacity-60'}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/** Zero sits in the middle: growth fills to the right (green), decline to the left (red). */
function DivergingBar({ value, maxAbsValue }: { value: number; maxAbsValue: number }) {
  const half =
    value === 0 || maxAbsValue === 0
      ? 0
      : Math.max(MIN_BAR_WIDTH_PERCENT, (Math.abs(value) / maxAbsValue) * 50);

  return (
    <div aria-hidden="true" className="relative h-1 rounded-full bg-bg-hover">
      <span className="absolute -inset-y-0.5 left-1/2 w-px bg-border-strong" />
      {half > 0 && (
        <div
          className={`absolute inset-y-0 ${
            value > 0
              ? 'left-1/2 rounded-r-full bg-text-success'
              : 'right-1/2 rounded-l-full bg-text-danger'
          }`}
          style={{ width: `${half}%` }}
        />
      )}
    </div>
  );
}

/** Signed percentage (`+25 %`, `-13,33 %`) coloured by direction; the sign also carries the meaning. */
export function DivergingValue({ value }: { value: number }) {
  // The pipeline stores percentage points (25 = 25 %), like the `percent` metrics.
  const format = useNumberFormatter({
    style: 'percent',
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  });
  const tone =
    value > 0 ? 'text-text-success' : value < 0 ? 'text-text-danger' : 'text-text-secondary';

  return (
    <span className={`w-10 shrink-0 text-left font-mono text-xs font-semibold sm:w-16 ${tone}`}>
      {format.format(value / 100)}
    </span>
  );
}
