import { supabase } from '../lib/supabaseClient';
import { distanceKm, boundingBox } from '../utils/geo';

const SHOP_CARD_COLUMNS =
  'id, name, category_id, logo_url, cover_image_url, is_open, is_active, rating_avg, rating_count, address_line, pincode, latitude, longitude, opening_time, closing_time, categories!shops_category_id_fkey(name)';

const PRODUCT_CARD_COLUMNS =
  'id, shop_id, category_id, name, description, price, unit, image_url, stock_quantity, is_available';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon_url, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * @param {{ categoryId?: string, search?: string, limit?: number, near?: { latitude: number, longitude: number, radiusKm?: number } }} opts
 */
export async function getShops({ categoryId, search, limit = 24, near } = {}) {
  let shopIdsFromTags = null;
  if (categoryId) {
    const { data: tagRows, error: tagError } = await supabase
      .from('shop_categories')
      .select('shop_id')
      .eq('category_id', categoryId);
    if (tagError) throw tagError;
    shopIdsFromTags = tagRows.map((r) => r.shop_id);
  }

  let query = supabase
    .from('shops')
    .select(SHOP_CARD_COLUMNS)
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(near ? 200 : limit); // wider pre-filter pool when we're about to distance-filter client-side

  if (categoryId) {
    // Match shops whose primary category is this one, OR that have tagged
    // themselves under it via shop_categories (multi-category shops).
    const idList = shopIdsFromTags.length ? shopIdsFromTags.join(',') : '00000000-0000-0000-0000-000000000000';
    query = query.or(`category_id.eq.${categoryId},id.in.(${idList})`);
  }
  if (search) query = query.ilike('name', `%${search}%`);

  if (near) {
    const radiusKm = near.radiusKm ?? 5;
    const box = boundingBox(near.latitude, near.longitude, radiusKm);
    query = query
      .gte('latitude', box.minLat)
      .lte('latitude', box.maxLat)
      .gte('longitude', box.minLng)
      .lte('longitude', box.maxLng);
  }

  const { data, error } = await query;
  if (error) throw error;

  if (!near) return data;

  const radiusKm = near.radiusKm ?? 5;
  return data
    .map((shop) => ({
      ...shop,
      distance_km: distanceKm(near.latitude, near.longitude, shop.latitude, shop.longitude),
    }))
    .filter((shop) => shop.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}

/**
 * Uses get_shop_public() RPC instead of a direct table select so the raw
 * phone number is never sent to the client unless the caller is eligible
 * (shop owner, or has an active order with this shop) — determined
 * server-side. Ineligible callers get an already-masked string back, not
 * the real digits (see SECURITY.md / audit notes for why this matters:
 * client-side-only masking still leaks the full number via the network
 * tab). Returns `{ ...shop, phone, phone_masked }`.
 */
export async function getShopById(shopId) {
  const { data, error } = await supabase.rpc('get_shop_public', { p_shop_id: shopId });
  if (error) throw error;
  const row = data?.[0];
  if (!row) return null;
  return {
    ...row,
    categories: row.category_name ? { name: row.category_name } : null,
  };
}

/**
 * @param {{ categoryId?: string, availableOnly?: boolean }} opts
 */
export async function getShopItems(shopId, { categoryId } = {}) {
  let query = supabase
    .from('shop_items')
    .select(PRODUCT_CARD_COLUMNS)
    .eq('shop_id', shopId)
    .order('name', { ascending: true });

  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * One-shot re-check right before checkout — never trust cart-held price/stock.
 */
export async function getShopItemsByIds(itemIds) {
  if (!itemIds?.length) return [];
  const { data, error } = await supabase
    .from('shop_items')
    .select('id, shop_id, name, price, unit, image_url, stock_quantity, is_available')
    .in('id', itemIds);
  if (error) throw error;
  return data;
}

/**
 * Debounced by the caller. Searches shops by name and products by name,
 * returned separately so the UI can render two sections.
 */
export async function searchMarketplace(term, { limit = 10 } = {}) {
  if (!term?.trim()) return { shops: [], products: [] };

  const [shopsRes, productsRes] = await Promise.all([
    supabase
      .from('shops')
      .select(SHOP_CARD_COLUMNS)
      .eq('is_active', true)
      .ilike('name', `%${term}%`)
      .limit(limit),
    supabase
      .from('shop_items')
      .select(`${PRODUCT_CARD_COLUMNS}, shops!inner(id, name, is_active)`)
      .eq('is_available', true)
      .eq('shops.is_active', true)
      .ilike('name', `%${term}%`)
      .limit(limit),
  ]);

  if (shopsRes.error) throw shopsRes.error;
  if (productsRes.error) throw productsRes.error;

  return { shops: shopsRes.data, products: productsRes.data };
}
