export async function fetchStatistics<T>(year: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`/api/statistics?year=${year}`, { signal });

  const data = await response.json();

  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    const error: any = new Error(data?.error || 'Error desconocido');
    error.status = response.status;
    throw error;
  }

  return data as T;
}
