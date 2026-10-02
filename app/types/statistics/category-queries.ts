import { PeriodKind } from '../period.types';
import {
  CategoryFamilies,
  categoriesGroupedByFamilies,
  StatisticCategories,
} from './category.types';
import {
  statisticCategoryPeriodConfig,
  StatisticCategoryPresentation,
  StatisticCategoryPresentationFor,
} from './category-mappings.types';
import { editorialSectionCategories, EditorialSections } from './editorial-section.types';

export function categoryFamily(category: StatisticCategories): CategoryFamilies {
  const family = (
    Object.entries(categoriesGroupedByFamilies) as [
      CategoryFamilies,
      readonly StatisticCategories[],
    ][]
  ).find(([, categories]) => categories.includes(category))?.[0];

  if (!family) {
    throw new Error(`No category family configured for statistic category: ${category}`);
  }

  return family;
}

export function getStatisticCategoryPresentation(
  category: StatisticCategories,
  periodKindValue: PeriodKind
): StatisticCategoryPresentation {
  const categoryConfig: StatisticCategoryPresentationFor = statisticCategoryPeriodConfig[category];
  const presentation = categoryConfig[periodKindValue];

  if (!presentation) {
    throw new Error(
      `Statistic category "${category}" does not support period kind "${periodKindValue}".`
    );
  }

  return presentation;
}

/**
 * Single source of truth for "which categories may this section surface for this period kind".
 * A section configured with categories that only exist for another `PeriodKind` (e.g.
 * `schoolsEvolutionSummary`'s categories are all `global`-only) must never be treated as
 * available for a period kind where every one of its categories is filtered out.
 */
export function getAllowedCategories(
  section: EditorialSections,
  kind: PeriodKind
): readonly StatisticCategories[] {
  const categories: readonly StatisticCategories[] = editorialSectionCategories[section];
  return categories.filter((category: StatisticCategories) => {
    const categoryConfig: StatisticCategoryPresentationFor =
      statisticCategoryPeriodConfig[category];
    return categoryConfig[kind] !== undefined;
  });
}
