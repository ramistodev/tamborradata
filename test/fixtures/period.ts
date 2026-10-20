import type { PeriodResponse } from '@/app/types/api/period.types';

export function makePeriod(overrides: Partial<PeriodResponse> = {}): PeriodResponse {
  return {
    periodKey: '2024',
    publicSlug: '2024',
    kind: 'year',
    lastPublishedAt: '2025-02-01T10:00:00.000Z',
    ...overrides,
  };
}

export function makeGlobalPeriod(overrides: Partial<PeriodResponse> = {}): PeriodResponse {
  return makePeriod({ periodKey: 'global', publicSlug: 'global', kind: 'global', ...overrides });
}

/** [global, 2025, 2024, 2023]: already in the order `getPeriods` returns (descending by periodKey). */
export function makePeriodList(): PeriodResponse[] {
  return [
    makeGlobalPeriod(),
    makePeriod({ periodKey: '2025', publicSlug: '2025' }),
    makePeriod(),
    makePeriod({ periodKey: '2023', publicSlug: '2023' }),
  ];
}
