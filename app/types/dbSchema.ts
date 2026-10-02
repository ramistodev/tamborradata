export const tables = {
  participants: 'participants',
  schools: 'schools',
  schoolAliases: 'school_aliases',
  scrapedUrls: 'scraped_urls',
  statsPeriods: 'stats_periods',
  statsRuns: 'stats_runs',
  statistics: 'statistics',
  statisticValues: 'statistic_values',
  statisticRanks: 'statistic_ranks',
  statisticSeries: 'statistic_series',
  statisticSummaries: 'statistic_summaries',
  statisticSummaryStatistics: 'statistic_summary_statistics',
  statsPeriodSlugAliases: 'stats_period_slug_aliases',
} as const;

export type TableName = (typeof tables)[keyof typeof tables];

export const statisticSummariesStatus = {
  pending: 'pending',
  completed: 'completed',
  published: 'published',
  archived: 'archived',
  failed: 'failed',
} as const;

export type StatisticSummariesStatus =
  (typeof statisticSummariesStatus)[keyof typeof statisticSummariesStatus];
