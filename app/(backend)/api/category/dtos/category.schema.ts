import 'server-only';
import { VALID_CATEGORIES, VALID_YEARS } from '@/app/(backend)/shared/constants/catalog';
import { CheckParamsType } from '../types';

export async function checkParams(year: string, category: string): Promise<CheckParamsType> {
  // Validar que se hayan proporcionado los parámetros
  if (!year || !category) {
    return {
      valid: false,
      cleanYear: null,
      cleanCategory: null,
      error: "Parametros 'year' y 'category' son obligatorios",
    };
  }

  // Validar categoria
  if (!VALID_CATEGORIES.includes(category)) {
    return {
      valid: false,
      cleanYear: null,
      cleanCategory: null,
      error: 'Categoría inválida. Esa categoria no existe',
    };
  }

  const cleanYear = year.trim(); // limpiar espacios en blanco

  // Validar formato de year
  if (year !== 'global' && !/^\d{4}$/.test(year)) {
    return {
      valid: false,
      cleanYear: null,
      cleanCategory: null,
      error: 'Formato de año inválido',
    };
  }

  // Validar año y categoria
  const validYears: string[] = await VALID_YEARS();
  if (!validYears.includes(year)) {
    return {
      valid: false,
      cleanYear: null,
      cleanCategory: null,
      error: `Año inválido. Años válidos: ${validYears.slice(0, 4).join(', ')}, ...`,
    };
  }

  return { valid: true, cleanYear: cleanYear, cleanCategory: category, error: null };
}
