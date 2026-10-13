import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { ParticipantsParams } from '../../../../types/api/participants.types';
import { CheckParamsResponse } from '../types';

const MIN_TOKENS = 3;

export function checkParams(params: ParticipantsParams): CheckParamsResponse {
  const { participant, schoolKey } = params;

  if (!participant || !schoolKey) {
    throw new ValidationError("Parameters like 'participant' and 'schoolKey' are required");
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

  if (tokens.length < MIN_TOKENS) {
    throw new ValidationError("The 'participant' parameter must contain at least three words");
  }

  return { tokens, schoolKey: cleanSchoolKey };
}
