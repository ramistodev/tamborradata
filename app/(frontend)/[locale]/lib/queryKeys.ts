export const queryKeys = {
  years: ['years'] as const,
  companies: ['companies'] as const,
  participants: (name: string, company: string) => ['participants', name, company] as const,
  statistics: (year: string) => ['statistics', year] as const,
  category: (category: string, year: string) => ['category', category, year] as const,
};
