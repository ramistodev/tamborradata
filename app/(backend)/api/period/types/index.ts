import { PeriodKind } from '../../../../types/period.types';

export interface PublishedPeriod {
  internal_key: string;
  public_slug: string;
  kind: PeriodKind;
  last_published_at: string;
  updated_at: string;
}
