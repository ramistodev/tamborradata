import type { OverviewResponse, TopEntry } from '@/app/types/api/overview.types';

type GlobalPeriod = NonNullable<OverviewResponse['globalPeriod']>;
type LastPeriod = NonNullable<OverviewResponse['lastPeriod']>;

export function makeTopEntry(overrides: Partial<TopEntry> = {}): TopEntry {
  return { label: 'Ane', count: 120, ...overrides };
}

export function makeGlobalOverview(overrides: Partial<GlobalPeriod> = {}): GlobalPeriod {
  return {
    publicSlug: 'global',
    startYear: 2000,
    endYear: 2025,
    totalParticipations: 52340,
    totalSchools: 87,
    editionsCount: 26,
    missingYears: [],
    lastPublishedAt: '2025-02-01T10:00:00.000Z',
    topName: makeTopEntry({ label: 'Ane', count: 1200 }),
    topSurname: makeTopEntry({ label: 'Garcia', count: 2400 }),
    topSchool: makeTopEntry({ label: 'Ikastola Test', count: 3100 }),
    ...overrides,
  };
}

export function makeLastOverview(overrides: Partial<LastPeriod> = {}): LastPeriod {
  return {
    publicSlug: '2025',
    year: 2025,
    totalParticipations: 2100,
    totalSchools: 60,
    growthRate: 5,
    lastPublishedAt: '2025-02-01T10:00:00.000Z',
    topName: makeTopEntry({ label: 'Maite', count: 60 }),
    topSurname: makeTopEntry({ label: 'Etxeberria', count: 90 }),
    topSchool: makeTopEntry({ label: 'Ikastola Test', count: 140 }),
    ...overrides,
  };
}

export function makeOverviewResponse(overrides: Partial<OverviewResponse> = {}): OverviewResponse {
  return { globalPeriod: makeGlobalOverview(), lastPeriod: makeLastOverview(), ...overrides };
}
