import type { ParticipantsResponse } from '../../../types/api/participants.types';

type FetchParticipantsParams = {
  participant: string;
  schoolKey: string;
  signal?: AbortSignal;
};

/** Records of `GET /api/participants`. A 404 means "no matches", so it resolves to an empty list. */
export async function fetchParticipants({
  participant,
  schoolKey,
  signal,
}: FetchParticipantsParams): Promise<ParticipantsResponse[]> {
  const searchParams = new URLSearchParams({ participant, schoolKey });
  const response = await fetch(`/api/participants?${searchParams}`, { signal });

  if (response.status === 404) {
    return [];
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error ?? 'Failed to fetch participants');
  }

  return body as ParticipantsResponse[];
}
