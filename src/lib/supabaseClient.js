import { createClient } from '@supabase/supabase-js';
import { env } from './env';

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  // Fail loudly in dev rather than silently falling back to mock behaviour.
  // eslint-disable-next-line no-console
  console.error(
    'NUKKAD: Supabase env vars missing. Check .env.local (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
  );
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
