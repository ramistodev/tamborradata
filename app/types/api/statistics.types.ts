import type { Locale } from '../locale';
import type { PeriodKind } from '../period.types';
import type {
  categoryDataShape,
  CategoryFamilies,
  EditorialSections,
  EntityType,
  PresentationsFor,
  StatisticCategories,
} from '../statistics';

export interface PeriodData {
  period: string;
  periodKind: PeriodKind;
  publishedAt: string;
  updatedAt: string;
}

export interface StatisticsResponse {
  metaData: PeriodData;
  overview: OverviewStatistic[];
  intro: EditorialTemplate;
  families: StatisticFamily[];
  outro: EditorialTemplate;
}

export interface SummariesResponse {
  metaData: PeriodData;
  locale: Locale;
  summaries: EditorialTemplate[];
}

export interface School {
  schoolId: string;
  canonicalName: string;
  schoolKey: string;
}

export interface StatisticRank {
  groupSchool?: School;
  entityType: EntityType;
  school?: School;
  entityKey?: string;
  entityLabel?: string;
  rank: number;
  value: number;
}

export interface StatisticValue {
  metricKey: string;
  valueNumeric?: number | null;
  valueText?: string | null;
  valueBoolean?: boolean | null;
}

export interface OverviewStatistic {
  category: StatisticCategories;
  metricKey: string;
  valueNumeric?: number | null;
  valueText?: string | null;
  valueBoolean?: boolean | null;
}

export interface StatisticSeriesPoint {
  entityType?: EntityType;
  school?: School;
  entityKey?: string;
  entityLabel?: string;
  metricKey: string;
  dimensionKey: string;
  dimensionOrder?: number;
  value?: number;
}

export interface EditorialTemplate {
  section: EditorialSections;
  summary: string;
}

/** `nextCursor` is an opaque token to request the next block; `null` means everything was delivered. */
export interface PageInfo {
  nextCursor: string | null;
}

export interface StatisticFamily {
  family: CategoryFamilies;
  template: EditorialTemplate;
  categories: StatisticCategory[];
}

type CategoryHeaderInfo = {
  [Category in StatisticCategories]: {
    category: Category;
  } & PresentationsFor<Category>;
}[StatisticCategories];

export type StatisticCategory =
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.values;
      data: StatisticValue[];
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.ranks;
      data: StatisticRank[];
      pageInfo: PageInfo;
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.series;
      data: StatisticSeriesPoint[];
    });

export type RankCategory = Extract<
  StatisticCategory,
  { dataShape: typeof categoryDataShape.ranks }
>;

export type ValuesCategory = Extract<
  StatisticCategory,
  { dataShape: typeof categoryDataShape.values }
>;

export type SeriesCategory = Extract<
  StatisticCategory,
  { dataShape: typeof categoryDataShape.series }
>;

export interface CategoryDetailRequest {
  period: string;
  category: StatisticCategories;
  cursor?: string;
  limit?: number;
}

export type CategoryDetailResponse =
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.values;
      data: StatisticValue[];
      pageInfo: PageInfo;
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.series;
      data: StatisticSeriesPoint[];
      pageInfo: PageInfo;
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.ranks;
      data: StatisticRank[];
      pageInfo: PageInfo;
    });
