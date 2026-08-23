import { supabase } from '../lib/supabaseClient';

const COLUMNS = 'id, profile_id, label, address_line, pincode, latitude, longitude, is_default, created_at';

export async function getAddresses() {
  const { data, error } = await supabase
    .from('addresses')
    .select(COLUMNS)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * profile_id is always taken from the current session server-side via RLS
 * (`profile_id = auth.uid()` policy) — passing it explicitly here just
 * satisfies the NOT NULL column; a client cannot write another user's row
 * because the insert policy would reject it regardless of what's sent.
 */
export async function addAddress({ profileId, label, addressLine, pincode, latitude, longitude, isDefault }) {
  if (isDefault) {
    await clearDefaultFlag();
  }
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      profile_id: profileId,
      label: label || null,
      address_line: addressLine,
      pincode,
      latitude,
      longitude,
      is_default: Boolean(isDefault),
    })
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAddress(id, { label, addressLine, pincode, latitude, longitude, isDefault }) {
  if (isDefault) {
    await clearDefaultFlag();
  }
  const { data, error } = await supabase
    .from('addresses')
    .update({
      label: label || null,
      address_line: addressLine,
      pincode,
      latitude,
      longitude,
      is_default: Boolean(isDefault),
    })
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}

export async function setDefaultAddress(id) {
  await clearDefaultFlag();
  const { data, error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

async function clearDefaultFlag() {
  // Scoped by RLS to the caller's own rows only.
  const { error } = await supabase.from('addresses').update({ is_default: false }).eq('is_default', true);
  if (error) throw error;
}
