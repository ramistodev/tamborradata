import 'server-only';
import { supabasePublic } from '../../db/supabasePublic';
import { log } from '../helpers/log';

export async function getSysStatus(): Promise<any | null> {
  try {
    const { data, error } = await supabasePublic
      .from('sys_status')
      .select('is_updating')
      .eq('id', 1)
      .single();

    if (error) return null;
    if (!data) return null;

    return data;
  } catch (error) {
    log(`Error obteniendo estado del sistema: ${JSON.stringify(error, null, 2)}`, 'error');
    return null;
  }
}
