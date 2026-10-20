import { createSupabaseMock } from './supabaseMock';
import { singleton } from './singleton';

export const supabase = singleton('supabase', createSupabaseMock);

export function supabaseClientModule() {
  return { supabaseClient: supabase.client };
}
