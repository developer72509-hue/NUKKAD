import { supabase } from '../lib/supabaseClient';

const SHOP_COLUMNS =
  'id, owner_id, name, description, category_id, phone, address_line, pincode, latitude, longitude, cover_image_url, logo_url, opening_time, closing_time, is_open, is_active, rating_avg, rating_count, created_at, updated_at, categories!shops_category_id_fkey(id, name)';

/**
 * A shop is 1:1 with its owner (UNIQUE(owner_id) at the DB level). Returns
 * null if the shopkeeper hasn't set one up yet — RLS already scopes this
 * to rows the caller owns, but we filter explicitly for clarity.
 */
export async function getMyShop(ownerId) {
  const { data, error } = await supabase
    .from('shops')
    .select(SHOP_COLUMNS)
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * owner_id is always the caller's own id — the shops_insert_shopkeeper
 * policy rejects any other value regardless of what's sent, but we still
 * only ever send the authenticated user's id here.
 */
export async function createShop(ownerId, payload) {
  if (import.meta.env.DEV) {
    console.log('[shopService.createShop] inserting', { owner_id: ownerId, ...payload });
  }
  const { data, error } = await supabase
    .from('shops')
    .insert({
      owner_id: ownerId,
      name: payload.name,
      description: payload.description || null,
      category_id: payload.categoryId,
      phone: payload.phone,
      address_line: payload.addressLine,
      pincode: payload.pincode,
      latitude: payload.latitude,
      longitude: payload.longitude,
      opening_time: payload.openingTime || null,
      closing_time: payload.closingTime || null,
    })
    .select(SHOP_COLUMNS)
    .single();
  if (import.meta.env.DEV) {
    console.log('[shopService.createShop] Supabase response', { data, error });
  }
  if (error) throw error;
  return data;
}

export async function updateShop(shopId, payload) {
  const { data, error } = await supabase
    .from('shops')
    .update({
      name: payload.name,
      description: payload.description || null,
      category_id: payload.categoryId,
      phone: payload.phone,
      address_line: payload.addressLine,
      pincode: payload.pincode,
      latitude: payload.latitude,
      longitude: payload.longitude,
      opening_time: payload.openingTime || null,
      closing_time: payload.closingTime || null,
      ...(payload.logoUrl !== undefined ? { logo_url: payload.logoUrl } : {}),
      ...(payload.coverImageUrl !== undefined ? { cover_image_url: payload.coverImageUrl } : {}),
    })
    .eq('id', shopId)
    .select(SHOP_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function toggleShopOpen(shopId, isOpen) {
  const { data, error } = await supabase
    .from('shops')
    .update({ is_open: isOpen })
    .eq('id', shopId)
    .select(SHOP_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Uploads to the shop-images bucket under `{shopId}/...` — storage RLS
 * requires that folder segment to match a shop owned by the caller, so the
 * shop row must already exist before calling this.
 */
export async function uploadShopImage(shopId, file, kind /* 'logo' | 'cover' */) {
  const ext = file.name.split('.').pop();
  const path = `${shopId}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('shop-images').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('shop-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function getShopCategoryIds(shopId) {
  const { data, error } = await supabase
    .from('shop_categories')
    .select('category_id')
    .eq('shop_id', shopId);
  if (error) throw error;
  return data.map((r) => r.category_id);
}

/**
 * Replaces the full category set for a shop (delete-then-insert, scoped by
 * RLS to shops the caller owns). categoryIds should include the primary
 * category too, so shops.category_id is always a member of this set.
 */
export async function setShopCategories(shopId, categoryIds) {
  const { error: deleteError } = await supabase
    .from('shop_categories')
    .delete()
    .eq('shop_id', shopId);
  if (deleteError) throw deleteError;

  if (!categoryIds?.length) return;

  const { error: insertError } = await supabase
    .from('shop_categories')
    .insert(categoryIds.map((category_id) => ({ shop_id: shopId, category_id })));
  if (insertError) throw insertError;
}
