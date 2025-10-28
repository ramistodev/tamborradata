import { supabase } from '@/app/lib/db/supabase';
import { log } from '../helpers/log';

export async function getFullStatistics(year: string, category: string) {
  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('full_data')
      .eq('year', year)
      .eq('category', category)
      .maybeSingle();

    if (error) {
      log(`Error fetching full statistics for ${category} (${year}): ${error.message}`, 'error');
      return null;
    }

    return data?.full_data ?? null;
  } catch (error) {
    log(`Error fetching full statistics for ${category} (${year}): ${error}`, 'error');
    return null;
  }
}
