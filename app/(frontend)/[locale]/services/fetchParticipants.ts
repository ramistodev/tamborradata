export async function fetchParticipants<T>(name: string, company: string): Promise<T> {
  const response = await fetch(
    `/api/participants?name=${encodeURIComponent(name)}&company=${encodeURIComponent(company)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Error fetching participants');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.participants as T;
}
