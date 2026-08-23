import { supabase } from '../lib/supabaseClient';

export async function listFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data; // { totp: [...], phone: [...] }
}

export async function enrollTotp() {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
  if (error) throw error;
  return data; // { id, totp: { qr_code, secret, uri } }
}

/**
 * First-time confirmation that the user actually set up their
 * authenticator app correctly (challenge + verify in one step).
 */
export async function confirmEnrollment(factorId, code) {
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (error) throw error;
  return data;
}

export async function unenroll(factorId) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
}

/**
 * If a previous enrollment attempt was started but never completed (QR
 * shown, but the user never entered a code), Supabase keeps that
 * unverified factor around and rejects a fresh enroll() with a "friendly
 * name already exists" collision. Clearing any unverified factors first
 * makes retrying always work cleanly.
 */
export async function cleanupUnverifiedFactors() {
  const { totp } = await listFactors();
  const unverified = (totp ?? []).filter((f) => f.status !== 'verified');
  for (const f of unverified) {
    await unenroll(f.id).catch(() => {});
  }
}

export async function getAssuranceLevel() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw error;
  return data; // { currentLevel, nextLevel }
}

/**
 * Login-time challenge — used after password sign-in when the account has
 * a verified TOTP factor and the session is still only aal1.
 */
export async function verifyLoginChallenge(factorId, code) {
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (error) throw error;
  return data;
}
