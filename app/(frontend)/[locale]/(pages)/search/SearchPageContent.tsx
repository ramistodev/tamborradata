import { OverviewResponse } from '../../../../types/api/overview.types';
import { SchoolListResult } from '../../../../types/api/schools.types';
import { FAQSection } from './components/FAQSection';
import { Hero } from './components/Hero';
import { OverviewSection } from './components/OverviewSection';
import { SearchSection } from './components/SearchSection';

export function SearchPageContent({
  schools,
  overview,
}: {
  schools: SchoolListResult[];
  overview: OverviewResponse | null;
}) {
  return (
    <div className="md:w-3/4 lg:w-2/3 w-full flex flex-col gap-20 px-4 sm:px-5 pb-5 pt-8 md:pt-15">
      <div className="flex flex-col gap-6">
        <Hero />
        <SearchSection schools={schools} />
      </div>
      <OverviewSection globalPeriod={overview?.globalPeriod} />
      <FAQSection globalPeriod={overview?.globalPeriod} />
    </div>
  );
}
