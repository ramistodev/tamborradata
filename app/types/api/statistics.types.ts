import type { categoryDataShape, PresentationsFor, StatisticCategories } from '../statistics';

export interface StatisticsResponse {
  period: string;
  overview: OverviewStatistic[];
  intro: IntroOutro;
  families: StatisticFamily[];
  outro: IntroOutro;
}

export interface SummariesResponse {
  period: string;
  locale: string;
  summaries: EditorialTemplate[];
}

export interface StatisticsParams {
  periodKey: string;
  locale: string;
}

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface School {
  schoolId: string;
  canonicalName: string;
  schoolKey: string;
}

export interface StatisticRank {
  statisticId: string;
  groupSchool?: School;
  entityType: string;
  school?: School;
  entityKey?: string;
  entityLabel?: string;
  rank: number;
  value: number;
}

export interface StatisticValue {
  statisticId: string;
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
  statisticId: string;
  entityType?: string;
  school?: School;
  entityKey?: string;
  entityLabel?: string;
  metricKey: string;
  dimensionKey: string;
  dimensionOrder?: number;
  value?: number;
}

export interface IntroOutro {
  section: string;
  summary: string;
}

export interface EditorialTemplate {
  section: string;
  summary: string;
}

export interface RankPageInfo {
  hasNextPage: boolean;
  nextCursor: number | null;
}

export interface SeriesPageInfo {
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface StatisticFamily {
  family: string;
  summary: string;
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
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.series;
      data: StatisticSeriesPoint[];
    });

export type CategoryDetailResponse =
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.values;
      data: StatisticValue[];
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.series;
      data: StatisticSeriesPoint[];
      pageInfo: SeriesPageInfo;
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.ranks;
      data: StatisticRank[];
      pageInfo: RankPageInfo;
    });
