export async function fetchStatistics<T>(year: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`/api/statistics?year=${year}`, { signal });

  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  const data = await response.json();

  if (data.error) throw new Error(data.error);

  return data as T;
}
