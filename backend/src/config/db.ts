import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
export const connectDB = async () => {
  try {
    // Try a simple query to test the connection
    // Using a table that should exist (messages is one of the first tables created)
    const { data, error } = await supabase.from('messages').select('id').limit(1);
    
    // If table doesn't exist, that's okay - we'll handle it gracefully
    if (error && error.code !== 'PGRST116' && error.message && !error.message.includes('does not exist')) {
      console.error('Supabase Connection Error ❌', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Don't exit - let the server start and show errors when routes are hit
      console.warn('⚠️  Supabase connection test failed, but server will continue. Check your environment variables and table setup.');
      return;
    }
    console.log('Supabase Connected ✅');
  } catch (error) {
    console.error('Supabase Connection Error ❌', error);
    // Don't exit - let the server start so we can see what's wrong
    console.warn('⚠️  Supabase connection test failed, but server will continue. Check your environment variables.');
  }
};

export default connectDB;
