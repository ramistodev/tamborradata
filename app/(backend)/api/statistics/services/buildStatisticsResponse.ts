import { editorialSections, categoryDataShape } from '../../../../types/statistics';
import type {
  EditorialTemplate,
  OverviewStatistic,
  PeriodData,
  StatisticCategory,
  StatisticFamily,
  StatisticsResponse,
} from '@/app/types/api/statistics.types';
import { log } from '../../../core/logger';
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
import { CursorPage } from '../lib/pagination';

type RawStatisticData =
  CursorPage<StatisticRankRaw> | StatisticSeriesPointRaw[] | StatisticValueRaw[];

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
  metaData: PeriodData,
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
    metaData,
    editorialTemplates,
    assignCategoriesToFamilies(categoryData, editorialTemplates, categories),
    buildOverview(overviewData, allSchoolsById)
  );
}

/**
 * Convierte cada resumen editorial crudo en un template público, resolviendo los tokens
 * {{school:id}} a nombre real. Un resumen con un token que no se puede resolver se deja fuera y se
 * reporta: un solo texto malformado no puede tumbar la página entera, los resúmenes son opcionales.
 */
export function resolveEditorialTemplates(
  summaries: PublishedEditorialSection[],
  allSchoolsById: AllSchoolsById
): EditorialTemplate[] {
  return summaries.flatMap((summary) => {
    try {
      return [
        {
          section: summary.section,
          summary: resolveSchoolIdSummary(summary.template, allSchoolsById),
        },
      ];
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      log(
        `[statistics] Summary '${summary.section}' (${summary.locale}) skipped: ${reason}`,
        'error'
      );
      return [];
    }
  });
}

/**
 * Agrupa las categorías ya normalizadas por su familia. Las familias salen de las estadísticas, no
 * de los resúmenes: el resumen es solo el texto opcional de cada familia, y si no hay uno publicado
 * se entrega vacío (como el intro y el outro), que el front no pinta. Ordenadas por nombre para que
 * la respuesta sea estable.
 */
function assignCategoriesToFamilies(
  categoryData: LoadedStatisticData[],
  editorialTemplates: EditorialTemplate[],
  categories: StatisticCategory[]
): StatisticFamily[] {
  const templatesBySection = new Map(
    editorialTemplates.map((template) => [template.section, template])
  );
  const families = new Map<StatisticFamily['family'], StatisticFamily>();

  categoryData.forEach(({ statistic }, index) => {
    const family: StatisticFamily = families.get(statistic.family) ?? {
      family: statistic.family,
      template: templatesBySection.get(statistic.family) ?? {
        section: statistic.family,
        summary: '',
      },
      categories: [],
    };

    family.categories.push(categories[index]);
    families.set(statistic.family, family);
  });

  return [...families.values()].sort((a, b) => a.family.localeCompare(b.family));
}

/**
 * Estadísticas candidatas al overview: de forma `values` (un escalar, no un ranking ni una serie)
 * y presentes en `overviewMetrics`. Una categoría que para este tipo de periodo es `series` (por
 * ejemplo `participantsGrowthRate` en `global`) queda filtrada sin más, porque su data_shape no es
 * `values`; así no hay una lista de overview por tipo de periodo que mantener sincronizada.
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

    return normalized.map((value) => ({
      category: statistic.category,
      ...value,
    }));
  });
}

// Ensambla el objeto final de respuesta: mete overview y families, y separa intro/outro del resto de secciones.
function createResponse(
  metaData: PeriodData,
  editorialTemplates: EditorialTemplate[],
  families: StatisticFamily[],
  overview: OverviewStatistic[]
): StatisticsResponse {
  const response: StatisticsResponse = {
    metaData,
    overview,
    intro: { section: editorialSections.periodIntro, summary: '' },
    families,
    outro: { section: editorialSections.periodOutro, summary: '' },
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
  // `renderer_key` se toma de la fila persistida y no se vuelve a derivar de un mapeo de categorías.
  // `assertStatisticPresentation` (llamada antes, en el service) garantiza en tiempo de ejecución
  // que `statistic.renderer_key` es exactamente el valor que permite esa combinación de categoría
  // y forma de datos; el cast de abajo solo le indica a TS lo que esa garantía ya estableció.
  if (statistic.data_shape === categoryDataShape.ranks) {
    const page = data as CursorPage<StatisticRankRaw>;

    return {
      category: statistic.category,
      dataShape: statistic.data_shape,
      rendererKey: statistic.renderer_key,
      pageInfo: {
        nextCursor: page.nextCursor,
      },
      data: normalizeData(page.items as StatisticRankRaw[], statistic.data_shape, allSchoolsById),
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
