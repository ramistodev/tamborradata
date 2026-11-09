import { useTranslations } from 'next-intl';
import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import { lineStats, type PointStat } from '../lib/stats';
import type { Dimension, Line } from '../types';

type SeriesSummaryProps = { line: Line; dimensions: Dimension[] };

type SummaryEntry = { label: string; point: PointStat; marker: React.ReactNode };

/** Key figures of a lone line, so the main reading does not depend on hovering the chart. */
export function SeriesSummary({ line, dimensions }: SeriesSummaryProps) {
  const t = useTranslations('Statistics.layout');
  const format = useNumberFormatter();
  const stats = lineStats(line, dimensions);

  if (!stats) {
    return null;
  }

  const { latest, peak } = stats;

  const entries: SummaryEntry[] = [
    {
      label: t('seriesLatest'),
      point: latest,
      marker: <span className="size-2 rounded-full" style={{ backgroundColor: line.color }} />,
    },
    {
      label: t('seriesPeak'),
      point: peak,
      marker: (
        <span className="size-2.5 rounded-full border-2" style={{ borderColor: line.color }} />
      ),
    },
  ];

  // Read left to right like the chart: the earlier edition goes first. When the peak is the
  // latest edition itself there is nothing to reorder.
  if (peak.index < latest.index) {
    entries.reverse();
  }

  return (
    <dl className="flex items-start justify-between gap-4 px-1">
      {entries.map(({ label, point, marker }, position) => (
        <Stat
          key={label}
          label={label}
          value={format.format(point.value)}
          hint={point.dimensionKey}
          marker={marker}
          alignEnd={position === entries.length - 1}
        />
      ))}
    </dl>
  );
}

type StatProps = {
  label: string;
  value: string;
  hint: string;
  /** Same mark the chart uses for this point, so the figure and the plot read together. */
  marker: React.ReactNode;
  alignEnd?: boolean;
};

function Stat({ label, value, hint, marker, alignEnd = false }: StatProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${alignEnd ? 'items-end text-right' : ''}`}>
      <dt
        className={`flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase ${
          alignEnd ? 'flex-row-reverse' : ''
        }`}
      >
        {marker}
        {label}
      </dt>
      <dd className="flex flex-col font-mono">
        <span className="text-lg leading-tight font-bold text-text sm:text-2xl md:text-3xl">
          {value}
        </span>
        <span className="text-xs text-text-tertiary sm:text-sm">{hint}</span>
      </dd>
    </div>
  );
}
