/** Metric keys the overview card reads from the statistics response. */
export const overviewMetricKey = {
  participantCount: 'participant_count',
  distinctCount: 'distinct_count',
  diversityPercentage: 'diversity_percentage',
  participantsWithMultipleNames: 'participants_with_multiple_names',
  multipleNamesRate: 'multiple_names_rate',
  recordYear: 'record_year',
  recordParticipantCount: 'record_participant_count',
  growthRate: 'growth_rate',
} as const;

export type OverviewMetricKey = (typeof overviewMetricKey)[keyof typeof overviewMetricKey];
