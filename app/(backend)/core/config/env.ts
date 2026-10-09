import 'server-only';

export const isDev = process.env.NODE_ENV === 'development';

export const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
export const supabaseUrl = process.env.SUPABASE_URL!;
export const signatureSecret = process.env.SIGNATURE_SECRET!;
