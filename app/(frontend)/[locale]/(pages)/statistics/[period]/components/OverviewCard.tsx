import { OverviewStatistic, PeriodData } from '@/app/types/api/statistics.types';
import { Metric, MetricSize, MetricTone, useOverviewCard } from '../hooks/useOverviewCard';

// Mobile first: regular values are text-sm, the important ones text-base, and both grow from `sm`
const VALUE_SIZES: Record<MetricSize, string> = {
  hero: 'text-base sm:text-[clamp(2.75rem,6vw,4.5rem)]',
  large: 'text-base sm:text-[clamp(1.75rem,3.5vw,2.25rem)]',
  normal: 'text-sm sm:text-xl md:text-2xl',
};

const VALUE_TONES: Record<MetricTone, string> = {
  default: 'text-text',
  accent: 'text-accent',
  positive: 'text-emerald-400',
  negative: 'text-red-400',
};

// Static class names so Tailwind can see them. From `sm` a row uses one column per metric; on
// mobile the rows disappear (`contents`) and all metrics share one 2-column grid.
const ROW_COLUMNS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

/** Period overview: rows of metrics (participants, variation, name and surname diversity...). */
export function OverviewCard({
  periodData,
  overview,
}: {
  periodData: PeriodData;
  overview: OverviewStatistic[];
}) {
  const { title, rows } = useOverviewCard({ periodData, overview });

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-1">
      <div className="col-span-2 flex items-center gap-2 bg-bg-secondary px-3 py-2 font-mono text-[10px] tracking-[.14em] text-text-secondary uppercase sm:col-span-1 sm:gap-3 sm:px-6 sm:py-3 sm:text-[11px]">
        <span className="size-1.5 rounded-full bg-accent" />
        <span>{title}</span>
      </div>

      {rows.map((row) => (
        <div
          key={row[0].label}
          className={`contents sm:grid sm:gap-px sm:bg-border ${ROW_COLUMNS[row.length]}`}
        >
          {row.map((metric) => (
            <ShowMetric key={metric.label} metric={metric} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ShowMetric({ metric }: { metric: Metric }) {
  const { label, value, secondary, size = 'normal', tone = 'default', fullWidthOnMobile } = metric;

  return (
    <div
      className={`flex flex-col justify-center gap-1 bg-bg-secondary px-3 py-3 sm:gap-2 sm:px-6 sm:py-6 ${fullWidthOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      <span className="font-mono text-[9px] tracking-[.14em] text-text-tertiary uppercase sm:text-[10px]">
        {label}
      </span>
      <span
        className={`font-mono leading-none font-bold tracking-[-.04em] ${VALUE_SIZES[size]} ${VALUE_TONES[tone]}`}
      >
        {value}
      </span>
      {secondary && (
        <span className="text-[11px] leading-tight text-text-secondary sm:text-xs">
          {secondary}
        </span>
      )}
    </div>
  );
}
