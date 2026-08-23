import { supabase } from '../lib/supabaseClient';
import { env } from '../lib/env';

/**
 * Calls the 'delete-account' Edge Function, which is the only place in this
 * codebase that ever touches the service_role key (server-side, injected
 * automatically by Supabase's Edge Function runtime). The function decides
 * server-side whether to hard-delete (no order history) or anonymise +
 * permanently ban (has order history, preserved as a lawful DPDP Rule 8
 * retention ground) — the frontend has no say in which path is taken.
 */
export async function deleteMyAccount() {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Not authenticated.');

  const res = await fetch(`${env.supabaseUrl}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Account deletion failed.');
  }
  return body; // { mode: 'deleted' | 'anonymised' }
}
