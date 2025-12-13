import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { Participants, ParticipantsType } from '../types';
import { log } from '../../../core/logger';

export async function fetchParticipants(
  partialName: string,
  company: string
): Promise<ParticipantsType> {
  try {
    const { data, error } = await supabaseClient
      .from('participants')
      .select('name, school, year')
      .ilike('name', `%${partialName}%`)
      .eq('school', company)
      .order('year', { ascending: false });

    if (error) {
      log(`Error al obtener participantes: ${error.message}`, 'error');
      return { participants: null, error: error.message };
    }

    if (!data || data.length === 0) {
      log('No se encontraron participantes.', 'error');
      return { participants: null, error: 'Error: No participants found' };
    }

    return { participants: data as Participants[], error: null };
  } catch (error) {
    log(`Unexpected error al obtener participantes: ${(error as Error).message}`, 'error');
    return { participants: null, error: (error as Error).message };
  }
}
