import { useFormatter, useTranslations } from 'next-intl';

type YearsTimelineProps = {
  startYear: number;
  endYear: number;
  missingYears: number[];
};

type YearRun = { from: number; to: number };

/** Axis marks between the two end labels, at most this many. */
const MAX_TICKS = 6;
const TICK_STEPS = [5, 10, 25, 50, 100];
/** Share of the width kept clear around the end labels, so a tick never overlaps them. */
const EDGE_MARGIN = 10;
/** Past this many missing years the gaps are counted instead of listed. */
const MAX_LISTED_GAPS = 6;

/** Groups consecutive years, so 2009 and 2010 are one gap instead of two touching ones. */
function toRuns(years: number[]): YearRun[] {
  const runs: YearRun[] = [];

  for (const year of [...years].sort((a, b) => a - b)) {
    const last = runs[runs.length - 1];

    if (last && year === last.to + 1) last.to = year;
    else runs.push({ from: year, to: year });
  }

  return runs;
}

function pickTickStep(span: number): number {
  return TICK_STEPS.find((step) => span / step <= MAX_TICKS) ?? TICK_STEPS[TICK_STEPS.length - 1];
}

/**
 * The whole range as one bar, with only the years without data cut out of it. Everything is placed
 * by percentage, so it costs one element per gap (not per year) and fits any width or range.
 */
export function YearsTimeline({ startYear, endYear, missingYears }: YearsTimelineProps) {
  const t = useTranslations('Search.timeline');
  const format = useFormatter();

  const span = endYear - startYear + 1;
  const step = pickTickStep(span);
  const isGapsCounted = missingYears.length > MAX_LISTED_GAPS;
  const years = format.list(missingYears.map(String), { type: 'conjunction' });
  const range = { startYear: String(startYear), endYear: String(endYear) };

  const ticks: { year: number; position: number }[] = [];
  for (let year = Math.ceil((startYear + 1) / step) * step; year < endYear; year += step) {
    const position = ((year - startYear + 0.5) / span) * 100;

    if (position > EDGE_MARGIN && position < 100 - EDGE_MARGIN) ticks.push({ year, position });
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={t('ariaLabel', range)}
        className="relative h-4 overflow-hidden rounded-md bg-accent sm:h-9"
      >
        {toRuns(missingYears).map(({ from, to }) => (
          <span
            key={from}
            title={
              from === to
                ? t('missingYear', { year: String(from) })
                : t('missingRange', { from: String(from), to: String(to) })
            }
            style={{
              left: `${((from - startYear) / span) * 100}%`,
              width: `${((to - from + 1) / span) * 100}%`,
              minWidth: '3px',
            }}
            className="absolute inset-y-0 border border-dashed border-border-strong bg-bg"
          />
        ))}
      </div>

      <div aria-hidden="true" className="relative h-4 font-mono text-xs text-text-tertiary">
        <span className="absolute left-0">{startYear}</span>
        {ticks.map(({ year, position }) => (
          <span
            key={year}
            style={{ left: `${position}%` }}
            className="absolute hidden -translate-x-1/2 sm:block"
          >
            {year}
          </span>
        ))}
        <span className="absolute right-0">{endYear}</span>
      </div>

      {/*
       * The bar is an image that only says the range. The gaps are real text, read once and also
       * available without a mouse (the `title` of each gap is hover-only). Past
       * MAX_LISTED_GAPS the years go into a native disclosure instead of a long line.
       */}
      {missingYears.length > 0 &&
        (isGapsCounted ? (
          <details className="font-mono text-xs text-text-tertiary sm:text-center">
            <summary className="cursor-pointer py-1">
              {t('gapsCount', { count: missingYears.length })}
            </summary>
            <p>{t('gapsCaption', { years })}</p>
          </details>
        ) : (
          <p className="font-mono text-xs text-text-tertiary sm:text-center">
            {t('gapsCaption', { years })}
          </p>
        ))}
    </div>
  );
}
