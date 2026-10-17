import { PeriodKind } from '../../../../types/period.types';

export interface PublishedPeriodRaw {
  internal_key: string;
  public_slug: string;
  kind: PeriodKind;
}
