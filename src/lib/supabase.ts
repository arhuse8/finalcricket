import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase config from Vite environment variables (will be populated once user sets them in Secrets)
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase Client with graceful fallback
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing. ' +
    'The application is running in local offline demo mode. Provide them in your AI Studio secrets!'
  );
}
