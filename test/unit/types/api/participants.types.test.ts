import { describe, expect, it } from 'vitest';
import {
  matchTypes,
  MAX_PARTICIPANT_LENGTH,
  MIN_PARTICIPANT_WORDS,
} from '@/app/types/api/participants.types';

describe('participants types', () => {
  it('pins the participant limits shared by the form and the API', () => {
    expect(MAX_PARTICIPANT_LENGTH).toBe(120);
    expect(MIN_PARTICIPANT_WORDS).toBe(3);
  });

  it('declares the match types', () => {
    expect(matchTypes).toEqual({
      exact: 'exact',
      compatible: 'compatible',
      incompatible: 'incompatible',
    });
  });
});
