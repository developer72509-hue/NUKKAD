// Central place to read environment variables.
// Values are injected by Vite from .env files (never hardcoded here).
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  appName: 'NUKKAD',
  appTagline: 'Your Local Market, Online.',
};
