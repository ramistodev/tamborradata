import { PeriodResponse } from '../../../../types/api/period.types';
import { getAllPublishedPeriods } from '../repo/period.repo';

export async function periodService(): Promise<PeriodResponse[]> {
  const publishedPeriods = await getAllPublishedPeriods();
  return publishedPeriods.map((period) => ({
    periodKey: period.internal_key,
    publicSlug: period.public_slug,
    kind: period.kind,
  }));
}
