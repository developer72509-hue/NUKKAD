import { supabase } from '../lib/supabaseClient';

/**
 * Bundles everything the authenticated user is allowed to read about
 * themselves (RLS-scoped, no new access granted) into one downloadable
 * JSON file — satisfies the DPDP right-to-access/portability request
 * without needing any new backend surface.
 */
export async function exportMyData(userId) {
  const [profile, addresses, orders, favorites, notifications, reviews] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('addresses').select('*').eq('profile_id', userId),
    supabase.from('orders').select('*, order_items(*)').eq('customer_id', userId),
    supabase.from('favorites').select('*').eq('profile_id', userId),
    supabase.from('notifications').select('*').eq('user_id', userId),
    supabase.from('reviews').select('*').eq('customer_id', userId),
  ]);

  const errors = [profile, addresses, orders, favorites, notifications, reviews]
    .map((r) => r.error)
    .filter(Boolean);
  if (errors.length) throw errors[0];

  return {
    exported_at: new Date().toISOString(),
    profile: profile.data,
    addresses: addresses.data,
    orders: orders.data,
    favorites: favorites.data,
    notifications: notifications.data,
    reviews: reviews.data,
  };
}

export function downloadAsJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
