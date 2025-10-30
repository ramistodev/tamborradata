import { supabase } from '@/app/(backend)/db/supabase';
import { log } from '../helpers/log';

export async function getStatistics(year: string) {
  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('category, public_data, summary')
      .eq('year', year)
      .order('public_data', { ascending: false })
      .limit(30);

    if (error) {
      log(`Error fetching statistics for year ${year}: ${error.message}`, 'error');
    }

    return data ?? null;
  } catch (error) {
    log(`Error fetching statistics for year ${year}: ${error}`, 'error');
    return null;
  }
}
