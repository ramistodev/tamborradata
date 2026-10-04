export const queryKeys = {
  participants: (name: string, company: string) => ['participants', name, company] as const,
  category: (category: string, year: string) => ['category', category, year] as const,
};
