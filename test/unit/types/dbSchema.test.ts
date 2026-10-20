import { describe, expect, it } from 'vitest';
import { nameResolutionStatus, statisticSummariesStatus, tables } from '@/app/types/dbSchema';

describe('dbSchema', () => {
  describe('tables', () => {
    it.each([
      ['statsPeriods', 'stats_periods'],
      ['statsPeriodSlugAliases', 'stats_period_slug_aliases'],
      ['statisticRanks', 'statistic_ranks'],
      ['statisticSeries', 'statistic_series'],
      ['statisticSummaries', 'statistic_summaries'],
      ['participantNameResolutions', 'participant_name_resolutions'],
    ] as const)('names %s as %s', (key, name) => {
      expect(tables[key]).toBe(name);
    });

    it('uses snake_case names', () => {
      const offenders = Object.values(tables).filter((name) => !/^[a-z_]+$/.test(name));

      expect(offenders).toEqual([]);
    });

    it('uses unique names', () => {
      const names = Object.values(tables);

      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('statuses', () => {
    it('pins the name resolution statuses used by the queries', () => {
      expect(nameResolutionStatus.resolved).toBe('resolved');
      expect(nameResolutionStatus.evidenceApplied).toBe('evidence_applied');
    });

    it('pins the published summary status', () => {
      expect(statisticSummariesStatus.published).toBe('published');
    });
  });
});
