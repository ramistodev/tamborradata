import { PeriodResponse } from '../../../../../types/api/period.types';
import { StatisticsResponse } from '../../../../../types/api/statistics.types';
import { ChapterNav } from './components/ChapterNav';
import { FamilyRender } from './components/family/FamilyRender';
import { Hero } from './components/Hero';
import { sortFamilies } from './utils/chapters';

export function PeriodPageContent({
  periods,
  stats,
}: {
  periods: PeriodResponse[];
  stats: StatisticsResponse;
}) {
  const sortedFamilies = sortFamilies(stats.families);

  return (
    <article className="w-full flex flex-col gap-6" aria-labelledby="year-page-title">
      <Hero
        periods={periods}
        periodData={stats.metaData}
        overview={stats.overview}
        intro={stats.intro}
      />
      <ChapterNav families={sortedFamilies} />
      <div className="flex flex-col gap-6 px-3 sm:px-10">
        {sortedFamilies.map((family) => (
          <FamilyRender key={family.family} family={family} />
        ))}
      </div>
    </article>
  );
}
