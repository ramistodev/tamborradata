import { useTranslations } from 'next-intl';
import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import { lineStats } from '../lib/stats';
import type { Dimension, Line } from '../types';

type SeriesLegendProps = {
  lines: Line[];
  dimensions: Dimension[];
  hiddenKeys: ReadonlySet<string>;
  /** Shows each line's latest value in its chip: on a phone there is no tooltip to read it from. */
  showLatest: boolean;
  onToggle: (key: string) => void;
  onFocus: (key: string | null) => void;
};

/** One chip per line: hover or focus highlights it, press to hide it (the last one stays). */
export function SeriesLegend({
  lines,
  dimensions,
  hiddenKeys,
  showLatest,
  onToggle,
  onFocus,
}: SeriesLegendProps) {
  const t = useTranslations('Statistics.layout');
  const format = useNumberFormatter();

  return (
    <ul aria-label={t('legendLabel')} className="flex flex-wrap gap-1.5">
      {lines.map((line) => {
        const isHidden = hiddenKeys.has(line.key);
        const latest = showLatest ? lineStats(line, dimensions)?.latest.value : undefined;

        return (
          <li key={line.key} className="max-w-full">
            <button
              type="button"
              aria-pressed={!isHidden}
              onClick={() => onToggle(line.key)}
              onPointerEnter={() => onFocus(line.key)}
              onPointerLeave={() => onFocus(null)}
              onFocus={() => onFocus(line.key)}
              onBlur={() => onFocus(null)}
              className={`inline-flex max-w-full cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isHidden
                  ? 'border-border bg-transparent text-text-tertiary line-through'
                  : 'border-border bg-bg-secondary text-text hover:border-border-strong'
              }`}
            >
              <span
                className="size-2 shrink-0 rounded-full transition-opacity"
                style={{ backgroundColor: line.color, opacity: isHidden ? 0.35 : 1 }}
              />
              <span className="truncate">{line.label}</span>
              {latest !== undefined && (
                <span className="shrink-0 font-mono font-bold">{format.format(latest)}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
