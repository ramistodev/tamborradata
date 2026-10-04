export async function fetchYears(url: string = '/api/years'): Promise<number[]> {
  // Saber los años disponibles desde la API
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch years');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.years.map(Number);
}
