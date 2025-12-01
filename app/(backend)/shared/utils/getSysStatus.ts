import 'server-only';
import { supabaseClient } from '../../core/db/supabaseClient';
import { log } from '../../core/logger';

export async function getSysStatus(): Promise<boolean | null> {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    if (isDev || month === 0 || (month === 1 && day <= 20)) {
      const { data: isUpdating, error } = await supabaseClient
        .from('sys_status')
        .select('is_updating')
        .eq('id', 1)
        .single();

      if (error) return false;
      if (!isUpdating) return false;

      return isUpdating.is_updating as boolean;
    }

    return false;
  } catch (error) {
    log(`Error obteniendo estado del sistema: ${JSON.stringify(error, null, 2)}`, 'error');
    return false;
  }
}
