export async function fetchStatistics<T>(year: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/statistics?year=${year}`);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      console.error(
        `Error fetching statistics for year ${year}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (!data) return null;

    data.statistics.year = data.year; // Añadir el año a los datos obtenidos

    return data as T;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}
