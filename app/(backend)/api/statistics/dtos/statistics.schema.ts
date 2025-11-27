import 'server-only';
import { VALID_YEARS } from '@/app/(backend)/shared/constants/catalog';
import { CheckParamsType } from '../types';

export async function checkParams(year: string): Promise<CheckParamsType> {
  if (!year) {
    return { valid: false, cleanYear: null, error: "El parámetro 'year' es obligatorio" };
  }

  const cleanYear = year.trim(); // limpiar espacios en blanco

  if (cleanYear !== 'global' && !/^\d{4}$/.test(cleanYear)) {
    return {
      valid: false,
      cleanYear: null,
      error: "El parámetro 'year' debe ser 'global' o un año válido de cuatro dígitos",
    };
  }

  // Validar año
  const validYears: string[] = await VALID_YEARS();
  if (!validYears.includes(year)) {
    return {
      valid: false,
      cleanYear: null,
      error: `Año inválido. Años válidos: ${validYears.slice(0, 4).join(', ')}, ...`,
    };
  }

  return { valid: true, cleanYear, error: null };
}
