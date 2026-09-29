import { editorialSections, categoryDataShape } from '../../../../types/statistics';
import type {
  EditorialTemplate,
  OverviewStatistic,
  StatisticCategory,
  StatisticFamily,
  StatisticsResponse,
} from '@/app/types/api/statistics.types';
import { normalizeData } from '../lib/normalizeData';
import { resolveSchoolIdSummary } from '../lib/resolveSchoolId';
import { overviewMetrics } from '../types';
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

type LoadedValueData = {
  statistic: StatisticsHeader;
  data: StatisticValueRaw[];
};

// Punto de entrada: arma la respuesta completa del período (overview, familias, intro/outro) a partir de los datos ya obtenidos.
export function buildStatisticsResponse(
  periodKey: string,
  summaries: PublishedEditorialSection[],
  categoryData: LoadedStatisticData[],
  overviewData: LoadedValueData[],
  allSchoolsById: AllSchoolsById
): StatisticsResponse {
  const categories = categoryData.map(({ statistic, data }) =>
    normalizeStatisticData(statistic, data, allSchoolsById)
  );
  const editorialTemplates = resolveEditorialTemplates(summaries, allSchoolsById);

  return createResponse(
    periodKey,
    editorialTemplates,
    assignCategoriesToFamilies(categoryData, editorialTemplates, categories),
    buildOverview(overviewData, allSchoolsById)
  );
}

// Convierte cada resumen editorial crudo en un template público, resolviendo los tokens {{school:id}} a nombre real.
export function resolveEditorialTemplates(
  summaries: PublishedEditorialSection[],
  allSchoolsById: AllSchoolsById
): EditorialTemplate[] {
  return summaries.map((summary) => ({
    section: summary.section,
    summary: resolveSchoolIdSummary(summary.template, allSchoolsById),
  }));
}

// Agrupa las categorías ya normalizadas dentro de su familia editorial (sección con resumen publicado).
export function assignCategoriesToFamilies(
  categoryData: LoadedStatisticData[],
  editorialTemplates: EditorialTemplate[],
  categories: StatisticCategory[]
): StatisticFamily[] {
  const categoriesByFamily = new Map<string, StatisticCategory[]>();
  categoryData.forEach(({ statistic }, index) => {
    const familyCategories = categoriesByFamily.get(statistic.family) ?? [];
    familyCategories.push(categories[index]);
    categoriesByFamily.set(statistic.family, familyCategories);
  });

  return editorialTemplates.flatMap((template) => {
    if (
      template.section === editorialSections.periodIntro ||
      template.section === editorialSections.periodOutro
    ) {
      return [];
    }

    return [
      {
        family: template.section,
        summary: template.summary,
        categories: categoriesByFamily.get(template.section) ?? [],
      },
    ];
  });
}

// Filtra qué estadísticas pertenecen a una sección familiar con resumen publicado (la usa el service para saber qué pedir, y esta misma lógica de agrupar arriba).
/**
 * The single predicate for "which statistics belong to a rendered family section" — shared by the
 * service (to know which categories to fetch raw data for) and this file's own grouping above, so
 * the two never drift out of sync the way a duplicated filter + positional-offset slice would.
 */
export function selectFamilyStatistics(
  statistics: StatisticsHeader[],
  summaries: PublishedEditorialSection[]
): StatisticsHeader[] {
  const familySections = new Set(
    summaries
      .map((summary) => summary.section)
      .filter(
        (section) =>
          section !== editorialSections.periodIntro && section !== editorialSections.periodOutro
      )
  );

  return statistics.filter((statistic) => familySections.has(statistic.family));
}

// Filtra qué estadísticas son candidatas al overview: forma "values" (escalar) y categoría listada en overviewMetrics.
/**
 * Statistics eligible for the overview: `values`-shaped (a scalar, not a ranking or a series) and
 * present in `overviewMetrics`. A category that's `series` for this period kind (e.g.
 * `participantsGrowthRate` on `global`) is filtered out here for free — its data_shape simply
 * isn't `values`, so there's no separate per-period-kind overview list to keep in sync.
 */
export function selectOverviewStatistics(statistics: StatisticsHeader[]): StatisticsHeader[] {
  return statistics.filter(
    (statistic) =>
      statistic.data_shape === categoryDataShape.values && statistic.category in overviewMetrics
  );
}

// A partir de los datos crudos ya cargados, se queda solo con los metric_key permitidos por overviewMetrics y reusa normalizeData para limpiar los null.
function buildOverview(
  overviewData: LoadedValueData[],
  allSchoolsById: AllSchoolsById
): OverviewStatistic[] {
  // Usamos flatMap para iterar en cada 'data' de cada 'statistic'
  return overviewData.flatMap(({ statistic, data }) => {
    // Filtramos solo los metric_key permitidos por overviewMetrics para la categoria actual iterada
    const allowedMetricKeys: readonly string[] | undefined =
      overviewMetrics[statistic.category as keyof typeof overviewMetrics];

    // Rechazamos todas las estadisticas que no tienen metric_key permitidos (overviewMetrics) para la categoria actual
    if (!allowedMetricKeys) {
      return [];
    }

    // Filtramos por cada metric_key permitido y normalizamos los datos (quitando nulls y resolviendo school_id a nombre real)
    const filtered = data.filter((value) => allowedMetricKeys.includes(value.metric_key));
    const normalized = normalizeData(filtered, categoryDataShape.values, allSchoolsById);

    return normalized.map(({ statisticId: _statisticId, ...value }) => ({
      category: statistic.category,
      ...value,
    }));
  });
}

// Ensambla el objeto final de respuesta: mete overview y families, y separa intro/outro del resto de secciones.
export function createResponse(
  periodKey: string,
  editorialTemplates: EditorialTemplate[],
  families: StatisticFamily[],
  overview: OverviewStatistic[]
): StatisticsResponse {
  const response: StatisticsResponse = {
    period: periodKey,
    overview,
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

// Convierte una estadística cruda (rank/value/series) en el objeto público StatisticCategory, según su data_shape.
function normalizeStatisticData(
  statistic: StatisticsHeader,
  data: RawStatisticData,
  allSchoolsById: AllSchoolsById
): StatisticCategory {
  // `renderer_key` is trusted from the persisted row, not re-derived from a category mapping.
  // `assertStatisticPresentation` (called upstream, in the service) is what guarantees at
  // runtime that `statistic.renderer_key` is the exact value this category/shape pair allows —
  // the cast below only tells TS what that runtime guarantee already established.
  if (statistic.data_shape === categoryDataShape.ranks) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statistic.renderer_key,
      data: normalizeData(data as StatisticRankRaw[], statistic.data_shape, allSchoolsById),
    } as StatisticCategory;
  }
  if (statistic.data_shape === categoryDataShape.values) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statistic.renderer_key,
      data: normalizeData(data as StatisticValueRaw[], statistic.data_shape, allSchoolsById),
    } as StatisticCategory;
  }
  if (statistic.data_shape === categoryDataShape.series) {
    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statistic.renderer_key,
      data: normalizeData(data as StatisticSeriesPointRaw[], statistic.data_shape, allSchoolsById),
    } as StatisticCategory;
  }

  throw new Error(`Unsupported statistic data shape: ${statistic.data_shape}`);
}
