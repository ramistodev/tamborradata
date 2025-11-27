import 'server-only';
export type CheckParamsType = {
  valid: boolean;
  cleanCategory: string | null;
  cleanYear: string | null;
  error: string | null;
};

export type FetchStatisticsType = {
  category: any[] | null;
  error: string | null;
};
