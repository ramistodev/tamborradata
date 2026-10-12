import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import type { TooltipEntry } from '../lib/stats';

type SeriesTooltipProps = {
  dimensionKey: string;
  /** x of the hovered edition, in viewBox units. */
  x: number;
  /** Width of the viewBox, to turn `x` into a percentage. */
  width: number;
  entries: TooltipEntry[];
};

/** Floating card with every line's value in the hovered edition and how it moved since the last. */
export function SeriesTooltip({ dimensionKey, x, width, entries }: SeriesTooltipProps) {
  const format = useNumberFormatter();
  const percent = useNumberFormatter({
    style: 'percent',
    maximumFractionDigits: 1,
    signDisplay: 'always',
  });
  if (entries.length === 0) {
    return null;
  }

  const left = (x / width) * 100;
  // Opens towards the middle of the chart so it never leaves the card.
  const shift = left < 25 ? '8px' : left > 75 ? 'calc(-100% - 8px)' : '-50%';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-xl border border-border-strong bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm"
      style={{ left: `${left}%`, transform: `translateX(${shift})` }}
    >
      <p className="mb-2 font-mono text-xs font-bold tracking-wider text-text-tertiary uppercase">
        {dimensionKey}
      </p>
      <ul className="flex flex-col gap-1.5">
        {entries.map(({ line, value, change }) => (
          <li key={line.key} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="flex-1 font-semibold text-text">{line.label}</span>
            <span className="font-mono font-bold text-text">{format.format(value)}</span>
            {change !== null && (
              <span
                className={`w-12 text-right font-mono text-xs ${
                  change >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {percent.format(change)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
