import { Participants } from '../types/types';

export async function fetchParticipants(
  name: string,
  company: string
): Promise<Participants[] | null> {
  try {
    const response = await fetch(
      `/api/participant?name=${encodeURIComponent(name)}&company=${encodeURIComponent(company)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.participants) {
      return null;
    }

    return data.participants as Participants[];
  } catch {
    return null;
  }
}
