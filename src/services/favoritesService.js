import { supabase } from '../lib/supabaseClient';

const SHOP_CARD_COLUMNS =
  'id, name, category_id, logo_url, cover_image_url, is_open, is_active, rating_avg, rating_count, address_line, pincode, categories!shops_category_id_fkey(name)';

/**
 * Lightweight — just the ids, used to hydrate favourite-state across the
 * whole app (heart icons on ShopCard/ShopProfile) without fetching full
 * shop rows everywhere.
 */
export async function getFavoriteShopIds() {
  const { data, error } = await supabase.from('favorites').select('shop_id');
  if (error) throw error;
  return data.map((f) => f.shop_id);
}

/**
 * Full shop cards for the Favourites page. RLS on `favorites` already
 * scopes this to the caller's own rows; the shops join only returns
 * public-readable shop columns.
 */
export async function getFavoriteShops() {
  const { data, error } = await supabase
    .from('favorites')
    .select(`shop_id, created_at, shops(${SHOP_CARD_COLUMNS})`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => row.shops).filter(Boolean);
}

export async function addFavorite(shopId, profileId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ profile_id: profileId, shop_id: shopId });
  // 23505 = unique_violation — already favourited, not a real error for the caller.
  if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(shopId) {
  const { error } = await supabase.from('favorites').delete().eq('shop_id', shopId);
  if (error) throw error;
}
