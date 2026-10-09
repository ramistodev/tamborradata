import { PeriodKind } from '../../../../types/period.types';

export interface PublishedPeriod {
  internal_key: string;
  public_slug: string;
  kind: PeriodKind;
}
