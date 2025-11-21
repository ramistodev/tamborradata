'server-only';
import { supabasePublic } from '../../db/supabasePublic';
import { log } from '../helpers/log';
import { Participant } from './types';

export async function getParticipant(name: string, company: string): Promise<Participant[] | null> {
  try {
    const tokens = name.toLowerCase().split(' ');
    const partialName = tokens.slice(0, 2).join(' '); // nombre + primer apellido

    const { data: results, error } = await supabasePublic
      .from('participants')
      .select('name, school, year')
      .ilike('name', `%${partialName}%`)
      .eq('school', company)
      .order('year', { ascending: false });

    if (error) {
      log(`Error al obtener el nombre o la compañia: ${error.message}`, 'error');
      return null;
    }

    if (!results || results.length === 0) return null;

    // Mirar si hay algún registro con dos apellidos completos
    const hasFullSurname = results.some((p) => p.name.split(' ').length > 2);

    // Si existen registros con dos apellidos → validar el segundo apellido correctamente
    if (hasFullSurname) {
      const inputSecondSurname = tokens[tokens.length - 1];

      const matchesSecondSurname = results.some((p) => {
        const parts = p.name.toLowerCase().split(' ');
        if (parts.length > 2) {
          const realSecond = parts[parts.length - 1];
          return realSecond === inputSecondSurname;
        }
        return false;
      });

      if (!matchesSecondSurname) {
        log(
          'No se ha encontrado ningún participante coincidente (no coincide el apellido).',
          'error'
        );
        return null;
      }
    }

    // Filtrar resultados finales correctamente
    const filtered = results.filter((p) => {
      const parts = p.name.toLowerCase().split(' ');

      // Los que solo tienen nombre + 1 apellido se aceptan siempre
      if (parts.length <= 2) return true;

      // Los que tienen nombre + 2 apellidos deben coincidir en el segundo apellido
      const realSecond = parts[parts.length - 1];
      const inputSecond = tokens[tokens.length - 1];
      return realSecond === inputSecond;
    });

    return filtered as Participant[];
  } catch (error) {
    log(`Unexpected error: ${(error as Error).message}`, 'error');
    return null;
  }
}
