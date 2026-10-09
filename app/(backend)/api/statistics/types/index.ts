import 'server-only';
import {
  CategoryFamilies,
  StatisticCategories,
  CategoryDataShape,
  CategoryRendererKey,
  EditorialSections,
  EntityType,
  overviewMetricKey,
  statisticCategories,
} from '../../../../types/statistics';
import type { PeriodData, School } from '@/app/types/api/statistics.types';
import { Locale } from '../../../../types/locale';
import { PeriodKind } from '../../../../types/period.types';

export type StatisticParams = {
  publicSlug: string;
  locale: Locale;
};

export interface PublishedPeriod {
  runId: string;
  kind: PeriodKind;
  metaData: PeriodData;
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
  entity_type: EntityType;
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
  entity_type?: EntityType | null;
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
  section: EditorialSections;
  locale: Locale;
}

export const overviewMetrics = {
  [statisticCategories.totalParticipants]: [overviewMetricKey.participantCount],
  [statisticCategories.namesDiversity]: [
    overviewMetricKey.distinctCount,
    overviewMetricKey.diversityPercentage,
  ],
  [statisticCategories.surnamesDiversity]: [
    overviewMetricKey.distinctCount,
    overviewMetricKey.diversityPercentage,
  ],
  [statisticCategories.participantsWithMultipleNames]: [
    overviewMetricKey.participantsWithMultipleNames,
    overviewMetricKey.multipleNamesRate,
  ],
  [statisticCategories.participationRecordYears]: [overviewMetricKey.recordYear, overviewMetricKey.recordParticipantCount],
  [statisticCategories.participantsGrowthRate]: [overviewMetricKey.growthRate],
} as const satisfies Partial<Record<StatisticCategories, readonly string[]>>;
