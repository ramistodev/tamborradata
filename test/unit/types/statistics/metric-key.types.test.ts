import { describe, expect, it } from 'vitest';
import { overviewMetricKey } from '@/app/types/statistics';

describe('overviewMetricKey', () => {
  it('pins the metric keys the overview reads', () => {
    expect(overviewMetricKey).toEqual({
      participantCount: 'participant_count',
      distinctCount: 'distinct_count',
      diversityPercentage: 'diversity_percentage',
      participantsWithMultipleNames: 'participants_with_multiple_names',
      multipleNamesRate: 'multiple_names_rate',
      recordYear: 'record_year',
      recordParticipantCount: 'record_participant_count',
      growthRate: 'growth_rate',
    });
  });
});
