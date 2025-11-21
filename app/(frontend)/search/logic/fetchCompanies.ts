export async function fetchCompanies(): Promise<string[] | null> {
  try {
    const response = await fetch('/api/companies', { cache: 'no-store' });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.companies as string[];
  } catch {
    return null;
  }
}
