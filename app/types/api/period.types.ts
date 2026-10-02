import { PeriodKind } from '../period.types';

export interface PeriodResponse {
  periodKey: string;
  publicSlug: string;
  kind: PeriodKind;
  publishedAt: string;
  updatedAt: string;
}
