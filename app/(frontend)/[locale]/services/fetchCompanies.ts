export async function fetchCompanies(): Promise<string[]> {
  // Obtener la lista de compañías desde la API
  const response = await fetch('/api/companies', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.companies as string[];
}
