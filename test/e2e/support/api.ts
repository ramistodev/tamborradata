import type { APIRequestContext } from '@playwright/test';

export const API_HEADERS = { accept: 'application/json' } as const;

export type PeriodItem = {
  periodKey: string;
  publicSlug: string;
  kind: 'year' | 'global';
  lastPublishedAt: string | null;
};

let cached: Promise<PeriodItem[]> | undefined;

/** Published periods from the live API. Cached per worker; a failure is not cached. */
export function discoverPeriods(request: APIRequestContext): Promise<PeriodItem[]> {
  cached ??= request
    .get('/api/period', { headers: API_HEADERS })
    .then(async (response) => {
      if (!response.ok()) throw new Error(`GET /api/period returned ${response.status()}`);
      return (await response.json()) as PeriodItem[];
    })
    .catch((error) => {
      cached = undefined;
      throw error;
    });
  return cached;
}

export function pickGlobal(periods: PeriodItem[]): PeriodItem | undefined {
  return periods.find((period) => period.kind === 'global');
}

/** Years sorted newest first. */
export function yearsNewestFirst(periods: PeriodItem[]): PeriodItem[] {
  return periods
    .filter((period) => period.kind === 'year')
    .sort((a, b) => Number(b.publicSlug) - Number(a.publicSlug));
}

export function pickYear(periods: PeriodItem[]): PeriodItem | undefined {
  return yearsNewestFirst(periods)[0];
}
