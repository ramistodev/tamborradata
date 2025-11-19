'server-only';
import { supabasePublic } from '../../db/supabasePublic';
import { log } from '../helpers/log';
import { Participant } from './types';

export async function getParticipant(name: string, company: string): Promise<Participant[] | null> {
  try {
    // Realizar la consulta a la base de datos
    const { data, error } = await supabasePublic
      .from('participants')
      .select('name, school, year')
      .ilike('name', `%${name}%`)
      .eq('school', company)
      .order('year', { ascending: false });

    if (error) {
      // Manejar el error de la consulta
      log(`Error fetching name or company: ${error.message}`, 'error');
      return null;
    }

    if (!data || data.length === 0) {
      // Buscar con un apellido menos
      const partialName = name.split(' ').slice(0, 2).join(' ');

      const { data: fallbackData, error: fallbackError } = await supabasePublic
        .from('participants')
        .select('name, school, year')
        .ilike('name', `%${partialName}%`)
        .eq('school', company)
        .order('year', { ascending: false });

      if (fallbackError) {
        log(`Error fetching name or company: ${fallbackError.message}`, 'error');
        return null;
      }

      return fallbackData as Participant[];
    }

    return data as Participant[];
  } catch (error) {
    log(`Unexpected error: ${(error as Error).message}`, 'error');
    return null;
  }
}
