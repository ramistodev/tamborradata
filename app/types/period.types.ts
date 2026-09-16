export const periodKind = {
  year: 'year',
  global: 'global',
} as const;

export type PeriodKind = (typeof periodKind)[keyof typeof periodKind];
