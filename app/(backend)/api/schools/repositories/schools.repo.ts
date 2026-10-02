import 'server-only';
import { supabaseClient } from '@/app/(backend)/core/db/supabaseClient';
import { tables } from '../../../../types/dbSchema';
import { SchoolRow } from '../types';

export async function getSchools(query?: string): Promise<SchoolRow[]> {
  let request = supabaseClient
    .from(tables.schools)
    .select('id, canonical_name, school_key')
    .order('canonical_name', { ascending: true });

  if (query) {
    request = request.ilike('canonical_name', `%${query}%`);
  }

  const { data: schools, error: schoolsError } = await request;

  if (schoolsError) {
    throw new Error(`Failed to fetch the schools: ${schoolsError.message}`);
  }

  return schools ?? [];
}
