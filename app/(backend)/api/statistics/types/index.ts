import 'server-only';
import {
  CategoryFamilies,
  StatisticCategories,
  CategoryDataShape,
  CategoryRendererKey,
  statisticCategories,
} from '../../../../types/statistics';
import type { JsonValue, School } from '@/app/types/api/statistics.types';

export type Pagination = {
  limit?: number;
  offset?: number;
};

export interface PublishedPeriod {
  publishedRunId: string;
}

export type AllSchoolsById = Map<string, School>;

export interface StatisticsHeader {
  id: string;
  category: StatisticCategories;
  data_shape: CategoryDataShape;
  renderer_key: CategoryRendererKey;
  family: CategoryFamilies;
}

export interface StatisticRankRaw {
  statistic_id: string;
  group_school_id?: string | null;
  entity_type: string;
  school_id?: string | null;
  entity_key?: string | null;
  entity_label?: string | null;
  rank: number;
  value: number;
}

export interface StatisticValueRaw {
  statistic_id: string;
  metric_key: string;
  value_numeric?: number | null;
  value_text?: string | null;
  value_boolean?: boolean | null;
  value_json?: JsonValue | null;
}

export interface StatisticSeriesPointRaw {
  statistic_id: string;
  entity_type?: string | null;
  school_id?: string | null;
  entity_key?: string | null;
  entity_label?: string | null;
  metric_key: string;
  dimension_key: string;
  dimension_order?: number | null;
  value?: number | null;
}

export type ResolveStatisticDataType =
  StatisticRankRaw | StatisticSeriesPointRaw | StatisticValueRaw;

export interface PublishedEditorialSection {
  id: string;
  template: string;
  section: string;
  locale: string;
}

export const overviewCategories: StatisticCategories[] = [
  statisticCategories.totalParticipants,
  statisticCategories.participantsGrowthRate,
  statisticCategories.namesDiversity,
  statisticCategories.surnamesDiversity,
  statisticCategories.averageSchoolSize,
  statisticCategories.topNames,
  statisticCategories.topSurnames,
];
