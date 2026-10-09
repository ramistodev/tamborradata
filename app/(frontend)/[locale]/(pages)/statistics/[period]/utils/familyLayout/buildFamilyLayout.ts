import type {
  RankCategory,
  SeriesCategory,
  StatisticCategory,
  StatisticFamily,
  ValuesCategory,
} from '../../../../../../../types/api/statistics.types';
import { categoryDataShape, categoryRendererKey } from '../../../../../../../types/statistics';
import { FEATURED_CATEGORIES } from './featured';

export type FamilyLayout = {
  series: SeriesCategory[];
  ranks: RankCategory[];
  values: ValuesCategory[];
  tables: RankCategory[];
};

// Construye el layout de una familia de categorias para saber luego como renderizarlas
export function buildFamilyLayout(family: StatisticFamily): FamilyLayout {
  const categories = sortByPriority(family, family.categories.filter(hasData));

  return {
    series: categories.filter(isSeries),
    ranks: categories.filter(isRanking),
    values: categories.filter(isValues),
    tables: categories.filter(isTable),
  };
}

function hasData(category: StatisticCategory): boolean {
  return category.data.length > 0;
}

function isSeries(category: StatisticCategory): category is SeriesCategory {
  return category.dataShape === categoryDataShape.series;
}

function isValues(category: StatisticCategory): category is ValuesCategory {
  return category.dataShape === categoryDataShape.values;
}

function isTable(category: StatisticCategory): category is RankCategory {
  return (
    (category.dataShape === categoryDataShape.ranks && category.rendererKey) ===
    categoryRendererKey.dataTable
  );
}

// A table is a ranks category too, but it gets its own block.
function isRanking(category: StatisticCategory): category is RankCategory {
  return category.dataShape === categoryDataShape.ranks && !isTable(category);
}

// Most important first; a category without priority goes last.
function sortByPriority(
  family: StatisticFamily,
  categories: StatisticCategory[]
): StatisticCategory[] {
  const priorities = FEATURED_CATEGORIES[family.family];

  const priorityOf = (category: StatisticCategory) => {
    return priorities.get(category.category) ?? Infinity;
  };

  return [...categories].sort((a, b) => priorityOf(a) - priorityOf(b));
}
