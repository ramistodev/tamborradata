import 'server-only';
export type CheckParamsType = {
  valid: boolean;
  cleanYear: string | null;
  error: string | null;
};

export type FetchStatisticsType = {
  statistics: any[] | null;
  error: string | null;
};

export type StatisticsType = {
  statistics: Record<string, any> | null;
  error: string | null;
};
