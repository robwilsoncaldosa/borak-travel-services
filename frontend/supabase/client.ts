import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export a typed Supabase client
export const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
