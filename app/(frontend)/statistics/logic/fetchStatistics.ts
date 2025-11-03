export async function fetchStatistics<T>(year: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/statistics?year=${year}`);
    const data = await response.json();

    if (!data.statistics) return null;

    data.statistics.year = data.year; // Añadir el año a los datos obtenidos

    return data.statistics as T;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics');
  }
}
