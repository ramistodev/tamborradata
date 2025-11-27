import 'server-only';
import { fetchYears } from '../repositories/years.repo';
import { YearsType } from '../types';

export async function getYears(): Promise<YearsType> {
  const { years, error } = await fetchYears();
  if (error || !years) {
    return { years: null, error };
  }

  const filteredYear: number[] = years
    .filter((y) => y !== 'global')
    .map(Number)
    .sort((a, b) => b - a);

  return { years: filteredYear, error: null };
}
