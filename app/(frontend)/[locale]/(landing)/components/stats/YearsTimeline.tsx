import { StatsCardTone, statsCardTones } from './statsCardTone';

/** One bar per edition year; years without data are left blank. Decorative: the note says which. */
export function YearsTimeline({
  startYear,
  endYear,
  missingYears,
  tone,
}: {
  startYear: number;
  endYear: number;
  missingYears: number[];
  tone: StatsCardTone;
}) {
  const styles = statsCardTones[tone];
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <div className="flex">
        {years.map((year, index) => {
          const last = index === years.length - 1;
          const first = index === 0;
          return (
            <span
              key={year}
              className={`h-1 flex-1 ${first ? 'rounded-l' : ''} ${last ? 'rounded-r' : ''} ${missingYears.includes(year) ? '' : styles.bar}`}
            />
          );
        })}
      </div>
      <div className={`flex justify-between font-mono text-xs ${styles.note}`}>
        <span>{startYear}</span>
        <span>{endYear}</span>
      </div>
    </div>
  );
}
