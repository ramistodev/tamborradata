export async function fetchSysStatus(): Promise<{ is_updating: boolean } | null> {
  try {
    const response = await fetch('/api/sys-status');

    if (!response.ok) {
      console.error('Failed to fetch system status');
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    return null;
  }
}
