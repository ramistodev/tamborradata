export async function fetchCategory<T>(category: string, year: string): Promise<T[]> {
  const response = await fetch(`/api/category?category=${category}&year=${year}`);

  if (!response.ok) {
    throw new Error('Failed to fetch category data');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.stats as T[];
}
