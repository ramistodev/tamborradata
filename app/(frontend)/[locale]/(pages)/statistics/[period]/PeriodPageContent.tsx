import { PeriodResponse } from '../../../../../types/api/period.types';
import { StatisticsResponse } from '../../../../../types/api/statistics.types';
import { ChapterNav } from './components/ChapterNav';
import { Hero } from './components/Hero';
import { CHAPTER_ORDER } from './utils/chapters';

export function PeriodPageContent({
  periods,
  stats,
}: {
  periods: PeriodResponse[];
  stats: StatisticsResponse;
}) {
  const chapterIds = CHAPTER_ORDER.filter((id) =>
    stats.families.some((family) => family.family === id)
  );

  return (
    <article className="w-full flex flex-col gap-6" aria-labelledby="year-page-title">
      <Hero
        periods={periods}
        periodData={stats.metaData}
        overview={stats.overview}
        intro={stats.intro}
      />
      <ChapterNav families={stats.families} />
      <div className="flex flex-col gap-6 px-3 sm:px-5">
        {/* TEMP: placeholder anchors to test the nav. Replace each one with its real chapter. */}
        {chapterIds.map((id) => (
          <section
            key={id}
            id={id}
            className="flex min-h-[80vh] scroll-mt-32 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary"
          >
            <h2 className="font-mono text-sm">#{id}</h2>
          </section>
        ))}
      </div>
    </article>
  );
}
