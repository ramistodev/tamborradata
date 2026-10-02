import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { ParticipantsParams } from '../../../../types/api/participants.types';
import { CheckParamsResponse } from '../types';

export async function checkParams(params: ParticipantsParams): Promise<CheckParamsResponse> {
  const { name, schoolKey } = params;
  // Validar que se hayan proporcionado los parámetros
  if (!name || !schoolKey) {
    throw new ValidationError("Parameters like 'name' and 'schoolKey' are required");
  }

  const cleanSchoolKey = schoolKey.trim();

  if (!cleanSchoolKey) {
    throw new ValidationError("The 'schoolKey' parameter cannot be empty");
  }

  // Normalizar nombre
  const cleanName = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanName.split(' ').length < 3) {
    throw new ValidationError("The 'name' parameter must contain at least three words");
  }

  return { cleanName, schoolKey: cleanSchoolKey };
}
