import type { StatisticCategories } from '../../../types/statistics';

export const queryKeys = {
  participants: (name: string, company: string) => ['participants', name, company] as const,
  category: (category: StatisticCategories, period: string, limit?: number) =>
    ['category', category, period, limit] as const,
};
