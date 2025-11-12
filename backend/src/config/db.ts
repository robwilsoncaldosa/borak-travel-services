import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Prefer service role key on server. Do NOT use this key in browser.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // recommended for server
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // only for client usage

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

// Prefer service role for backend operations
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
if (!supabaseKey) {
  throw new Error('Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY.');
}

// If running on Node <18, ensure fetch is available (uncomment if needed):
// import fetch from 'node-fetch';
// if (!globalThis.fetch) globalThis.fetch = fetch as any;

export const supabase = createClient(SUPABASE_URL, supabaseKey);

// Test connection (non-fatal)
export const connectDB = async () => {
  try {
    const { data, error } = await supabase.from('messages').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !/does not exist/i.test(String(error.message))) {
      console.error('Supabase connection test error:', { message: error.message, code: error.code });
      return;
    }
    console.log('Supabase Connected ✅');
  } catch (err) {
    console.error('Supabase connection test failed', err);
  }
};

export default connectDB;
