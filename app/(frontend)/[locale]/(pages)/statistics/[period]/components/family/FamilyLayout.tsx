import type { StatisticFamily } from '../../../../../../../types/api/statistics.types';
import { buildFamilyLayout } from '../../utils/familyLayout/buildFamilyLayout';
import { RankRender } from '../renders/Rank';
import { CategoryGroup } from './CategoryGroup';
import { SeriesRender } from '../renders/Series';
import { ValuesGrid } from './ValuesGrid';

/** Lays out the categories of a family: key figures first, then series and ranks. */
export function FamilyLayout({ family }: { family: StatisticFamily }) {
  const sortedCategories = buildFamilyLayout(family);

  return (
    <div className="flex flex-col gap-4">
      {sortedCategories.series.length > 0 && (
        <CategoryGroup title="Series" categories={sortedCategories.series}>
          {sortedCategories.series.map((category) => (
            <SeriesRender key={category.category} category={category} />
          ))}
        </CategoryGroup>
      )}
      {sortedCategories.ranks.length > 0 && (
        <CategoryGroup title="Rankings" categories={sortedCategories.ranks}>
          {sortedCategories.ranks.map((category) => (
            <RankRender key={category.category} category={category} />
          ))}
        </CategoryGroup>
      )}
      <ValuesGrid categories={sortedCategories.values} />
    </div>
  );
}
