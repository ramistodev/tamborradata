export async function fetchYears() {
  // Saber los años disponibles desde la API
  try {
    const response = await fetch('/api/available-years');
    const data = await response.json();
    if (!data.years) {
      throw new Error('No years data found');
    }

    return data.years;
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
}
