import { useTranslations } from 'next-intl';
import type { StatisticFamily } from '../../../../../../../types/api/statistics.types';
import { buildFamilyLayout } from '../../utils/familyLayout/buildFamilyLayout';
import { RankRender } from '../renders/Rank';
import { CategoryGroup } from './CategoryGroup';
import { SeriesRender } from '../renders/Series';
import { ValuesGrid } from './ValuesGrid';
import { DataTableRender } from '../renders/DataTable';

/** Lays out the categories of a family: key figures first, then series and ranks. */
export function FamilyLayout({ family }: { family: StatisticFamily }) {
  const t = useTranslations('Statistics.layout');
  const sortedCategories = buildFamilyLayout(family);

  return (
    <div className="flex flex-col gap-4">
      {sortedCategories.series.length > 0 && (
        <CategoryGroup title={t('groups.series')} categories={sortedCategories.series}>
          {sortedCategories.series.map((category) => (
            <SeriesRender key={category.category} category={category} />
          ))}
        </CategoryGroup>
      )}
      {sortedCategories.ranks.length > 0 && (
        <CategoryGroup title={t('groups.rankings')} categories={sortedCategories.ranks}>
          {sortedCategories.ranks.map((category) => (
            <RankRender key={category.category} category={category} />
          ))}
        </CategoryGroup>
      )}
      {sortedCategories.tables.length > 0 && (
        <CategoryGroup title={t('groups.tables')} categories={sortedCategories.tables}>
          {sortedCategories.tables.map((category) => (
            <DataTableRender key={category.category} category={category} />
          ))}
        </CategoryGroup>
      )}
      <ValuesGrid categories={sortedCategories.values} />
    </div>
  );
}
