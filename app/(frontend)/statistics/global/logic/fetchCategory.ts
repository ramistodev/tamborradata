export async function fetchCategory<T>(category: string, year: string): Promise<T[] | null> {
  try {
    const response = await fetch(`/api/category?category=${category}&year=${year}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data.stats as T[];
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
