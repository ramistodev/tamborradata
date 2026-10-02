import 'server-only';
import {
  CategoryFamilies,
  StatisticCategories,
  CategoryDataShape,
  CategoryRendererKey,
  statisticCategories,
} from '../../../../types/statistics';
import type { School } from '@/app/types/api/statistics.types';
import { PeriodKind } from '../../../../types/period.types';

export type StatisticParams = {
  periodKey: string;
  locale: string;
};

export interface PublishedPeriod {
  runId: string;
  kind: PeriodKind;
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
  id: string;
  group_school_id?: string | null;
  entity_type: string;
  school_id?: string | null;
  entity_key?: string | null;
  entity_label?: string | null;
  rank: number;
  value: number;
}

export interface StatisticValueRaw {
  metric_key: string;
  value_numeric?: number | null;
  value_text?: string | null;
  value_boolean?: boolean | null;
}

export interface StatisticSeriesPointRaw {
  entity_type?: string | null;
  school_id?: string | null;
  entity_key?: string | null;
  entity_label?: string | null;
  metric_key: string;
  dimension_key: string;
  dimension_order?: number | null;
  value?: number | null;
}

export interface PublishedEditorialSection {
  id: string;
  template: string;
  section: string;
  locale: string;
}

export const overviewMetrics = {
  [statisticCategories.totalParticipants]: ['participant_count'],
  [statisticCategories.namesDiversity]: ['distinct_count', 'diversity_percentage'],
  [statisticCategories.surnamesDiversity]: ['distinct_count', 'diversity_percentage'],
  [statisticCategories.participantsWithMultipleNames]: [
    'participants_with_multiple_names',
    'multiple_names_rate',
  ],
  [statisticCategories.participationRecordYears]: ['record_year', 'record_participant_count'],
  [statisticCategories.participantsGrowthRate]: ['growth_rate'],
} as const satisfies Partial<Record<StatisticCategories, readonly string[]>>;
