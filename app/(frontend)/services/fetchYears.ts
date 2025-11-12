export async function fetchYears(): Promise<string[]> {
  // Saber los años disponibles desde la API
  try {
    const response = await fetch('/api/available-years');
    const data = await response.json();
    if (!data.years || data.years.length === 0) {
      console.error('No years data found');
      return [];
    }

    return data.years;
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
}
