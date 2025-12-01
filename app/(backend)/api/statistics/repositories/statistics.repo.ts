import 'server-only';
import { log } from '@/app/(backend)/core/logger';
import { supabaseClient } from '@/app/(backend)/core/db/supabaseClient';
import { FetchStatisticsType } from '../types';

export async function fetchStatistics(year: string): Promise<FetchStatisticsType> {
  try {
    const { data, error } = await supabaseClient
      .from('statistics')
      .select('category, public_data, summary')
      .eq('year', year)
      .order('public_data', { ascending: false })
      .limit(30);

    if (error) {
      log(`Error fetching statistics for year ${year}: ${error.message}`, 'error');
      return { statistics: null, error: 'Error de la base de datos' };
    }

    return { statistics: data ?? null, error: null };
  } catch (error) {
    log(`Error fetching statistics for year ${year}: ${JSON.stringify(error, null, 2)}`, 'error');
    return { statistics: null, error: 'Error inesperado, por favor intente nuevamente más tarde' };
  }
}
