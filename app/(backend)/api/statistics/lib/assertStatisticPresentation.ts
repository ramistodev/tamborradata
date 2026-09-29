import 'server-only';
import { getStatisticCategoryPresentation } from '../../../../types/statistics';
import { PeriodKind } from '../../../../types/period.types';
import type { StatisticsHeader } from '../types';

/**
 * Validates a published statistic header against the category/period contract declared in
 * `statisticCategoryPeriodConfig`. A mismatch here means the pipeline persisted a
 * `data_shape`/`renderer_key` combination the current category configuration does not expect —
 * a server-side integrity error, never a client input error.
 */
export function assertStatisticPresentation(statistic: StatisticsHeader, kind: PeriodKind): void {
  const presentation = getStatisticCategoryPresentation(statistic.category, kind);

  if (
    presentation.dataShape !== statistic.data_shape ||
    presentation.rendererKey !== statistic.renderer_key
  ) {
    throw new Error(
      `Integrity error: published statistic "${statistic.category}" for period kind "${kind}" ` +
        `has data_shape "${statistic.data_shape}"/renderer_key "${statistic.renderer_key}" in the ` +
        `database, but the category configuration expects ` +
        `"${presentation.dataShape}"/"${presentation.rendererKey}".`
    );
  }
}
