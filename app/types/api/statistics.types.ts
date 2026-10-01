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

export interface School {
  schoolId: string;
  canonicalName: string;
  schoolKey: string;
}

export interface StatisticRank {
  groupSchool?: School;
  entityType: string;
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

/** `nextCursor` is an opaque token to request the next block; `null` means everything was delivered. */
export interface PageInfo {
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
      pageInfo: PageInfo;
    })
  | (CategoryHeaderInfo & {
      dataShape: typeof categoryDataShape.series;
      data: StatisticSeriesPoint[];
    });

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
