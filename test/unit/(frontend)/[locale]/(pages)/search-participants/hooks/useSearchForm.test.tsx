import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchForm } from '@/app/(frontend)/[locale]/(pages)/search-participants/hooks/useSearchForm';
import { RateLimitedError } from '@/app/(frontend)/[locale]/lib/errors';
import { fetchParticipants } from '@/app/(frontend)/[locale]/services/fetchParticipants';
import { makeParticipantsResponse } from '@/test/fixtures/participants';
import { createQueryWrapper } from '@/test/helpers/queryClient';

vi.mock('@/app/(frontend)/[locale]/services/fetchParticipants', () => ({ fetchParticipants: vi.fn() }));

const event = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

describe('useSearchForm', () => {
  beforeEach(() => {
    vi.mocked(fetchParticipants).mockReset();
  });

  it('exposes an empty, invalid initial form', () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    expect(result.current).toMatchObject({
      name: '', schoolKey: null, search: null, isNameValid: false, canSubmit: false,
      retryAfterSeconds: null, data: undefined, isFetching: false, isError: false,
    });
    expect(result.current.resultsHeadingId).not.toBe('');
  });

  it('requires three name words and a school', () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    act(() => result.current.setName('Ane Garcia'));
    expect(result.current.isNameValid).toBe(false);
    act(() => result.current.setName('Ane Garcia Lopez'));
    expect(result.current.isNameValid).toBe(true);
    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.setSchoolKey('sk'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('focuses the first invalid field without searching', () => {
    const input = document.createElement('input');
    const button = document.createElement('button');
    document.body.append(input, button);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    result.current.nameInputRef.current = input;
    result.current.schoolDropdownRef.current = button;
    const invalidName = event();
    act(() => result.current.handleSubmit(invalidName));
    expect(invalidName.preventDefault).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(input);
    expect(result.current.search).toBeNull();
    expect(fetchParticipants).not.toHaveBeenCalled();
    act(() => result.current.setName('Ane Garcia Lopez'));
    act(() => result.current.handleSubmit(event()));
    expect(document.activeElement).toBe(button);
  });

  it('normalizes a valid name and exposes the response', async () => {
    const response = [makeParticipantsResponse()];
    vi.mocked(fetchParticipants).mockResolvedValue(response);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    act(() => {
      result.current.setName('  Ane   Garcia  Lopez ');
      result.current.setSchoolKey('sk');
    });
    act(() => result.current.handleSubmit(event()));
    expect(result.current.search).toEqual({ participant: 'Ane Garcia Lopez', schoolKey: 'sk' });
    await waitFor(() => expect(result.current.data).toEqual(response));
    expect(fetchParticipants).toHaveBeenCalledWith({
      participant: 'Ane Garcia Lopez', schoolKey: 'sk', signal: expect.any(AbortSignal),
    });
  });

  it('ignores another submit while fetching', async () => {
    let resolve!: (value: ReturnType<typeof makeParticipantsResponse>[]) => void;
    vi.mocked(fetchParticipants).mockReturnValue(new Promise((done) => { resolve = done; }));
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    act(() => {
      result.current.setName('Ane Garcia Lopez');
      result.current.setSchoolKey('sk');
    });
    act(() => result.current.handleSubmit(event()));
    await waitFor(() => expect(result.current.isFetching).toBe(true));
    act(() => result.current.setName('Maite Garcia Lopez'));
    act(() => result.current.handleSubmit(event()));
    expect(result.current.search?.participant).toBe('Ane Garcia Lopez');
    expect(fetchParticipants).toHaveBeenCalledOnce();
    act(() => resolve([makeParticipantsResponse()]));
  });

  it.each([
    [new RateLimitedError(120), 120],
    [new Error('x'), null],
  ])('maps query error details for %#', async (error, retryAfterSeconds) => {
    vi.mocked(fetchParticipants).mockRejectedValue(error);
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    act(() => {
      result.current.setName('Ane Garcia Lopez');
      result.current.setSchoolKey('sk');
    });
    act(() => result.current.handleSubmit(event()));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.retryAfterSeconds).toBe(retryAfterSeconds);
  });

  it('clears all form and submitted values', () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSearchForm(), { wrapper });
    act(() => {
      result.current.setName('Ane Garcia Lopez');
      result.current.setSchoolKey('sk');
    });
    act(() => result.current.handleSubmit(event()));
    act(() => result.current.clear());
    expect(result.current).toMatchObject({ name: '', schoolKey: null, search: null });
  });
});
