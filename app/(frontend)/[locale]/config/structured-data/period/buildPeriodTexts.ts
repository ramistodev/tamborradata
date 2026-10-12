import { periodKind } from '@/app/types/period.types';
import type { PeriodFacts } from './buildPeriodFacts';
import type { Formatter, StatisticsTranslator } from './types';

const NAMES_IN_DESCRIPTION = 3;

/**
 * Title and description of a period page. Shared by the page metadata and the structured data, so
 * Google reads the same thing in both. The description carries real figures (participants, the
 * most common names) when the data has them, because a specific snippet beats a generic one.
 */
export function buildPeriodTexts(facts: PeriodFacts, t: StatisticsTranslator, format: Formatter) {
  const isGlobal = facts.kind === periodKind.global;
  const range = { first: facts.firstPeriod, last: facts.lastPeriod };
  const participants =
    facts.participants === null
      ? null
      : format.number(facts.participants, { useGrouping: 'always' });
  const names = format.list(
    facts.topNames.slice(0, NAMES_IN_DESCRIPTION).map(({ label }) => label),
    { type: 'conjunction', style: 'long' }
  );
  const hasData = participants !== null && facts.topNames.length > 0;

  if (isGlobal) {
    return {
      title: t('period.globalTitle', range),
      description:
        participants === null
          ? t('period.globalDescription', range)
          : t('period.globalDataDescription', { ...range, participants }),
    };
  }

  return {
    title: t('period.title', { period: facts.period }),
    description: hasData
      ? t('period.dataDescription', { period: facts.period, participants, names })
      : t('period.description', { period: facts.period }),
  };
}
