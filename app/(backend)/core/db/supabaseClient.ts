import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../config/env';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
