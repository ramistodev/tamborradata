import 'server-only';
import { supabasePublic } from '@/app/(backend)/db/supabasePublic';
import { log } from '../helpers/log';

export async function getStatistics(year: string) {
  try {
    const { data, error } = await supabasePublic
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
    log(`Error fetching statistics for year ${year}: ${JSON.stringify(error, null, 2)}`, 'error');
    return null;
  }
}
