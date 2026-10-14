import type { StatisticCategories } from '../../../types/statistics';

export const queryKeys = {
  participants: (participant: string, schoolKey: string) =>
    ['participants', participant, schoolKey] as const,
  category: (category: StatisticCategories, period: string, limit?: number) =>
    ['category', category, period, limit] as const,
};
