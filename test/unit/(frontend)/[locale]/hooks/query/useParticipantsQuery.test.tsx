import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useParticipantsQuery } from '@/app/(frontend)/[locale]/hooks/query/useParticipantsQuery';
import { RateLimitedError } from '@/app/(frontend)/[locale]/lib/errors';
import { queryKeys } from '@/app/(frontend)/[locale]/lib/queryKeys';
import { fetchParticipants } from '@/app/(frontend)/[locale]/services/fetchParticipants';
import { makeParticipantsResponse } from '@/test/fixtures/participants';
import { createQueryWrapper } from '@/test/helpers/queryClient';

vi.mock('@/app/(frontend)/[locale]/services/fetchParticipants', () => ({ fetchParticipants: vi.fn() }));

describe('useParticipantsQuery', () => {
  beforeEach(() => {
    vi.mocked(fetchParticipants).mockReset();
  });

  it.each([['', ''], ['Ane Garcia Lopez', ''], ['', 'sk']])(
    'stays idle for incomplete parameters %#',
    (participant, schoolKey) => {
      const { wrapper } = createQueryWrapper();
      const { result } = renderHook(() => useParticipantsQuery(participant, schoolKey), { wrapper });
      expect(fetchParticipants).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    },
  );

  it('fetches and caches a response object for valid parameters', async () => {
    const response = [makeParticipantsResponse()];
    vi.mocked(fetchParticipants).mockResolvedValue(response);
    const { client, wrapper } = createQueryWrapper();
    const { result, rerender } = renderHook(
      () => useParticipantsQuery('Ane Garcia Lopez', 'sk'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchParticipants).toHaveBeenCalledWith({
      participant: 'Ane Garcia Lopez', schoolKey: 'sk', signal: expect.any(AbortSignal),
    });
    expect(result.current.data).toEqual(response);
    expect(client.getQueryData(queryKeys.participants('Ane Garcia Lopez', 'sk'))).toEqual(response);
    rerender();
    expect(fetchParticipants).toHaveBeenCalledOnce();
  });

  it('reports ordinary errors without retrying', async () => {
    const error = new Error('x');
    vi.mocked(fetchParticipants).mockRejectedValue(error);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useParticipantsQuery('Ane Garcia Lopez', 'sk'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect(fetchParticipants).toHaveBeenCalledOnce();
  });

  it('preserves rate-limit error details', async () => {
    const error = new RateLimitedError(120);
    vi.mocked(fetchParticipants).mockRejectedValue(error);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useParticipantsQuery('Ane Garcia Lopez', 'sk'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect(result.current.error).toMatchObject({ retryAfterSeconds: 120 });
    expect(fetchParticipants).toHaveBeenCalledOnce();
  });
});
