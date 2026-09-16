import { categoryDataShape, CategoryDataShape } from '../../../../types/statistics';
import type {
  StatisticRank,
  StatisticSeriesPoint,
  StatisticValue,
} from '@/app/types/api/statistics.types';
import {
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticValueRaw,
  AllSchoolsById,
} from '../types';
import { resolveSchool } from './resolveSchoolId';

type NormalizedStatisticData = StatisticRank[] | StatisticSeriesPoint[] | StatisticValue[];

export function normalizeData(
  data: StatisticRankRaw[],
  shape: typeof categoryDataShape.ranks,
  allSchoolsById: AllSchoolsById
): StatisticRank[];
export function normalizeData(
  data: StatisticSeriesPointRaw[],
  shape: typeof categoryDataShape.series,
  allSchoolsById: AllSchoolsById
): StatisticSeriesPoint[];
export function normalizeData(
  data: StatisticValueRaw[],
  shape: typeof categoryDataShape.values,
  allSchoolsById: AllSchoolsById
): StatisticValue[];
export function normalizeData(
  data: StatisticRankRaw[] | StatisticSeriesPointRaw[] | StatisticValueRaw[],
  shape: CategoryDataShape,
  allSchoolsById: AllSchoolsById
): NormalizedStatisticData {
  switch (shape) {
    case categoryDataShape.ranks:
      return normalizeRankData(data as StatisticRankRaw[], allSchoolsById);
    case categoryDataShape.series:
      return normalizeSeriesData(data as StatisticSeriesPointRaw[], allSchoolsById);
    case categoryDataShape.values:
      return normalizeValueData(data as StatisticValueRaw[]);
  }
}

function normalizeRankData(data: StatisticRankRaw[], allSchoolsById: AllSchoolsById): StatisticRank[] {
  return data.map((item) => ({
    statisticId: item.statistic_id,
    entityType: item.entity_type,
    rank: item.rank,
    value: item.value,
    ...(item.group_school_id && { groupSchool: resolveSchool(item.group_school_id, allSchoolsById) }),
    ...(item.school_id && { school: resolveSchool(item.school_id, allSchoolsById) }),
    ...(item.entity_key && { entityKey: item.entity_key }),
    ...(item.entity_label && { entityLabel: item.entity_label }),
  }));
}

function normalizeSeriesData(
  data: StatisticSeriesPointRaw[],
  allSchoolsById: AllSchoolsById
): StatisticSeriesPoint[] {
  return data
    .filter((item) => item.value !== null)
    .map((item) => ({
      statisticId: item.statistic_id,
      metricKey: item.metric_key,
      dimensionKey: item.dimension_key,
      ...(item.entity_type && { entityType: item.entity_type }),
      ...(item.school_id && { school: resolveSchool(item.school_id, allSchoolsById) }),
      ...(item.entity_key && { entityKey: item.entity_key }),
      ...(item.entity_label && { entityLabel: item.entity_label }),
      ...(item.dimension_order !== null &&
        item.dimension_order !== undefined && {
          dimensionOrder: item.dimension_order,
        }),
      ...(item.value !== null && item.value !== undefined && { value: item.value }),
    }));
}

function normalizeValueData(data: StatisticValueRaw[]): StatisticValue[] {
  return data.map((item) => ({
    statisticId: item.statistic_id,
    metricKey: item.metric_key,
    ...(item.value_numeric !== null &&
      item.value_numeric !== undefined && {
        valueNumeric: item.value_numeric,
      }),
    ...(item.value_text !== null &&
      item.value_text !== undefined && { valueText: item.value_text }),
    ...(item.value_boolean !== null &&
      item.value_boolean !== undefined && {
        valueBoolean: item.value_boolean,
      }),
    ...(item.value_json !== null &&
      item.value_json !== undefined && { valueJson: item.value_json }),
  }));
}
