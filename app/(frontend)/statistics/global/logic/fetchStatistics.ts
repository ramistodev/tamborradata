import { GlobalStats } from '../types/types';

export async function fetchStatistics(year: string): Promise<GlobalStats> {
  try {
    const response = await fetch(`/api/statistics?year=${year}`);
    const data = await response.json();

    return data.statistics as GlobalStats;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics');
  }
}
