import { useTranslations } from 'next-intl';
import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import { lineStats } from '../lib/stats';
import type { Dimension, Line } from '../types';

type SeriesSummaryProps = { line: Line; dimensions: Dimension[] };

/** Key figures of a lone line, so the main reading does not depend on hovering the chart. */
export function SeriesSummary({ line, dimensions }: SeriesSummaryProps) {
  const t = useTranslations('Statistics.layout');
  const format = useNumberFormatter();
  const percent = useNumberFormatter({
    style: 'percent',
    maximumFractionDigits: 1,
    signDisplay: 'always',
  });
  const stats = lineStats(line, dimensions);

  if (!stats) {
    return null;
  }

  const { latest, peak, change } = stats;

  return (
    <dl className="grid grid-cols-3 gap-2 sm:gap-3">
      <Stat
        label={t('seriesLatest')}
        value={format.format(latest.value)}
        hint={latest.dimensionKey}
      />
      <Stat label={t('seriesPeak')} value={format.format(peak.value)} hint={peak.dimensionKey} />
      <Stat
        label={t('seriesChange')}
        value={change === null ? '—' : percent.format(change)}
        tone={change === null ? undefined : change >= 0 ? 'up' : 'down'}
      />
    </dl>
  );
}

const TONES = { up: 'text-success', down: 'text-danger' } as const;

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-bg-secondary px-3 py-2.5">
      <dt className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-text-tertiary uppercase">
        {label}
      </dt>
      <dd
        className={`font-mono text-base font-bold sm:text-lg ${tone ? TONES[tone] : 'text-text'}`}
      >
        {value}
        {hint && <span className="ml-1.5 text-[10px] font-medium text-text-tertiary">{hint}</span>}
      </dd>
    </div>
  );
}
