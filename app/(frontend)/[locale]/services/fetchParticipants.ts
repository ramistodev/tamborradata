import type { ParticipantsResponse } from '../../../types/api/participants.types';
import { RateLimitedError } from '../lib/errors';

type FetchParticipantsParams = {
  participant: string;
  schoolKey: string;
  signal?: AbortSignal;
};

/** Records of `POST /api/participants`. No matches resolves to an empty list. */
export async function fetchParticipants({
  participant,
  schoolKey,
  signal,
}: FetchParticipantsParams): Promise<ParticipantsResponse[]> {
  const response = await fetch('/api/participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participant, schoolKey }),
    signal,
  });

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('Retry-After'));
    throw new RateLimitedError(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60);
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error ?? 'Failed to fetch participants');
  }

  return body as ParticipantsResponse[];
}
