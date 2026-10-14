import { StatisticCategories } from '../../../../types/statistics';
import { PeriodKind } from '../../../../types/period.types';

export interface OverviewPeriodRow {
  published_run_id: string;
  kind: PeriodKind;
  public_slug: string;
  start_year: number | null;
  end_year: number | null;
  last_published_at: string | null;
}

export interface OverviewValueRow {
  metric_key: string;
  value_numeric: number | null;
}

export interface OverviewRankRow {
  entity_label: string | null;
  value: number;
  schools: { canonical_name: string } | null;
}

export interface OverviewStatisticRow {
  id: string;
  category: StatisticCategories;
  statistic_values: OverviewValueRow[];
  statistic_ranks: OverviewRankRow[];
}
