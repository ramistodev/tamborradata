import 'server-only';
import { ValidationError } from '../../../lib/errors';
import {
  MAX_PARTICIPANT_LENGTH,
  MIN_PARTICIPANT_WORDS,
} from '../../../../types/api/participants.types';
import { CheckParamsResponse } from '../types';

/** The body comes straight from `req.json()`, so nothing about its shape can be trusted. */
export function checkParams(body: unknown): CheckParamsResponse {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('The request body must be a JSON object');
  }

  const { participant, schoolKey } = body as Record<string, unknown>;

  if (typeof participant !== 'string' || typeof schoolKey !== 'string') {
    throw new ValidationError("Parameters 'participant' and 'schoolKey' must be strings");
  }

  if (!participant || !schoolKey) {
    throw new ValidationError("Parameters like 'participant' and 'schoolKey' are required");
  }

  if (participant.length > MAX_PARTICIPANT_LENGTH) {
    throw new ValidationError(
      `The 'participant' parameter cannot be longer than ${MAX_PARTICIPANT_LENGTH} characters`
    );
  }

  const cleanSchoolKey = schoolKey.trim();

  if (!cleanSchoolKey) {
    throw new ValidationError("The 'schoolKey' parameter cannot be empty");
  }

  // Same normalization as participants.name_key: no accents, lowercase
  const tokens = participant
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length < MIN_PARTICIPANT_WORDS) {
    throw new ValidationError("The 'participant' parameter must contain at least three words");
  }

  return { tokens, schoolKey: cleanSchoolKey };
}
