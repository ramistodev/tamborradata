import 'server-only';
import { log } from '@/app/(backend)/core/logger';
import { CheckParamsType } from '../types';

export async function checkParams(name: string, company: string): Promise<CheckParamsType> {
  // Validar que se hayan proporcionado los parámetros
  if (!name || !company) {
    log("Error: Parametros 'name' y 'company' son obligatorios", 'error');
    return { valid: false, cleanName: '', error: "Parametros 'name' y 'company' son obligatorios" };
  }

  // Normalizar nombre
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanName.split(' ').length < 3) {
    log('Error: Por favor, proporciona al menos un nombre y dos apellidos', 'error');
    return {
      valid: false,
      cleanName: '',
      error: 'Por favor, proporciona al menos un nombre y dos apellidos',
    };
  }

  return { valid: true, cleanName, error: null };
}
