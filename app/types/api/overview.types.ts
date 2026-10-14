export const overviewScope = {
  both: 'both',
  global: 'global',
  last: 'last',
} as const;

export type OverviewScope = (typeof overviewScope)[keyof typeof overviewScope];

export interface OverviewParams {
  scope: OverviewScope;
}

// Each key is present only when the requested `scope` includes it
export interface OverviewResponse {
  globalPeriod?: {
    publicSlug: string;
    startYear: number;
    endYear: number;
    totalParticipations: number;
    totalSchools: number;
    editionsCount: number;
    missingYears: number[];
    lastPublishedAt: string;
    topName: TopEntry;
    topSurname: TopEntry;
    topSchool: TopEntry;
  };
  lastPeriod?: {
    publicSlug: string;
    year: number;
    totalParticipations: number;
    totalSchools: number;
    // `null` when there is no previous edition to compare with
    growthRate: number | null;
    lastPublishedAt: string;
    topName: TopEntry;
    topSurname: TopEntry;
    topSchool: TopEntry;
  };
}

export interface TopEntry {
  label: string;
  count: number;
}
