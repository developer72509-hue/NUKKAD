import { supabase } from '../lib/supabaseClient';

/**
 * role is passed as auth user_metadata so the DB trigger handle_new_user()
 * picks it up server-side (defaults to 'customer' if missing/invalid —
 * enforced in Postgres, not trusted from the client).
 *
 * emailRedirectTo is computed from the running origin (not hardcoded) so it
 * works whether the app is served on :5173, a preview URL, or production.
 * NOTE: Supabase only honours this if the exact URL (or a matching pattern)
 * is added to Authentication → URL Configuration → Redirect URLs in the
 * Supabase dashboard — that allowlist can't be changed from this codebase.
 */
export async function signUp({ email, password, role, fullName, phone, termsAccepted }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName, phone, terms_accepted: Boolean(termsAccepted) },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Re-sends the signup confirmation email. Supabase rate-limits this
 * server-side; the cooldown in the UI is a courtesy, not the real guard.
 */
export async function resendConfirmation({ email }) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function sendOtp({ email }) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function verifyOtp({ email, token, type = 'signup' }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });
  if (error) throw error;
  return data;
}

/**
 * profiles.role is the source of truth for authorization (never trust a
 * client-side claim). Called after session hydration to populate role.
 */
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, phone, avatar_url, language')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * role is intentionally never included here — the DB trigger
 * (prevent_role_change) rejects any attempt to change it anyway, but the
 * frontend also shouldn't offer that as an editable field.
 */
export async function updateProfile(userId, { fullName, phone, language }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, phone, language })
    .eq('id', userId)
    .select('id, role, full_name, phone, avatar_url, language')
    .single();
  if (error) throw error;
  return data;
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session, event);
  });
  return () => data.subscription.unsubscribe();
}
