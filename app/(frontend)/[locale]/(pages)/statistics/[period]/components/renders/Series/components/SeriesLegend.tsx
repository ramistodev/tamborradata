import type { Line } from '../types';

type SeriesLegendProps = {
  lines: Line[];
  hiddenKeys: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onFocus: (key: string | null) => void;
};

/** One chip per line: hover or focus highlights it, press to hide it (the last one stays). */
export function SeriesLegend({ lines, hiddenKeys, onToggle, onFocus }: SeriesLegendProps) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {lines.map((line) => {
        const isHidden = hiddenKeys.has(line.key);

        return (
          <li key={line.key}>
            <button
              type="button"
              aria-pressed={!isHidden}
              onClick={() => onToggle(line.key)}
              onPointerEnter={() => onFocus(line.key)}
              onPointerLeave={() => onFocus(null)}
              onFocus={() => onFocus(line.key)}
              onBlur={() => onFocus(null)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isHidden
                  ? 'border-border bg-transparent text-text-tertiary line-through'
                  : 'border-border bg-bg-secondary text-text hover:border-border-strong'
              }`}
            >
              <span
                className="size-2 shrink-0 rounded-full transition-opacity"
                style={{ backgroundColor: line.color, opacity: isHidden ? 0.35 : 1 }}
              />
              {line.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
