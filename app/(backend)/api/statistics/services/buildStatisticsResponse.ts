import {
  editorialSections,
  categoryDataShape,
  statisticCategoryRendererKey,
} from '../../../../types/statistics';
import type {
  EditorialTemplate,
  StatisticCategory,
  StatisticFamily,
  StatisticsResponse,
} from '@/app/types/api/statistics.types';
import { normalizeData } from '../lib/normalizeData';
import { resolveSchoolIdSummary } from '../lib/resolveSchoolId';
import type {
  StatisticsHeader,
  AllSchoolsById,
  PublishedEditorialSection,
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticValueRaw,
} from '../types';

type RawStatisticData = StatisticRankRaw[] | StatisticSeriesPointRaw[] | StatisticValueRaw[];

type LoadedStatisticData = {
  statistic: StatisticsHeader;
  data: RawStatisticData;
};

export function buildStatisticsResponse(
  periodKey: string,
  summaries: PublishedEditorialSection[],
  categoryData: LoadedStatisticData[],
  allSchoolsById: AllSchoolsById
): StatisticsResponse {
  const categories = categoryData.map(({ statistic, data }) =>
    normalizeStatisticData(statistic, data, allSchoolsById)
  );
  const editorialTemplates = resolveEditorialTemplates(summaries, allSchoolsById);

  return createResponse(
    periodKey,
    editorialTemplates,
    assignCategoriesToFamilies(categoryData, editorialTemplates, categories)
  );
}

export function resolveEditorialTemplates(
  summaries: PublishedEditorialSection[],
  allSchoolsById: AllSchoolsById
): EditorialTemplate[] {
  return summaries.map((summary) => ({
    section: summary.section,
    summary: resolveSchoolIdSummary(summary.template, allSchoolsById),
  }));
}

export function assignCategoriesToFamilies(
  categoryData: LoadedStatisticData[],
  editorialTemplates: EditorialTemplate[],
  categories: StatisticCategory[]
): StatisticFamily[] {
  let categoryOffset = 0;
  return editorialTemplates.flatMap((template) => {
    if (
      template.section === editorialSections.periodIntro ||
      template.section === editorialSections.periodOutro
    ) {
      return [];
    }
    const familyCategoryCount = categoryData.filter(
      ({ statistic }) => statistic.family === template.section
    ).length;
    const family: StatisticFamily = {
      family: template.section,
      summary: template.summary,
      categories: categories.slice(categoryOffset, categoryOffset + familyCategoryCount),
    };
    categoryOffset += familyCategoryCount;
    return [family];
  });
}

export function createResponse(
  periodKey: string,
  editorialTemplates: EditorialTemplate[],
  families: StatisticFamily[]
): StatisticsResponse {
  const response: StatisticsResponse = {
    period: periodKey,
    overview: [],
    intro: { section: '', summary: '' },
    families,
    outro: { section: '', summary: '' },
  };

  for (const template of editorialTemplates) {
    if (template.section === editorialSections.periodIntro) {
      response.intro = template;
    }
    if (template.section === editorialSections.periodOutro) {
      response.outro = template;
    }
  }

  return response;
}

function normalizeStatisticData(
  statistic: StatisticsHeader,
  data: RawStatisticData,
  allSchoolsById: AllSchoolsById
): StatisticCategory {
  if (statistic.data_shape === categoryDataShape.ranks) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statisticCategoryRendererKey[statistic.category],
      data: normalizeData(data as StatisticRankRaw[], statistic.data_shape, allSchoolsById),
    };
  }
  if (statistic.data_shape === categoryDataShape.values) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statisticCategoryRendererKey[statistic.category],
      data: normalizeData(data as StatisticValueRaw[], statistic.data_shape, allSchoolsById),
    };
  }
  if (statistic.data_shape === categoryDataShape.series) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statisticCategoryRendererKey[statistic.category],
      data: normalizeData(data as StatisticSeriesPointRaw[], statistic.data_shape, allSchoolsById),
    };
  }

  throw new Error(`Unsupported statistic data shape: ${statistic.data_shape}`);
}
