import { supabase } from '../lib/supabaseClient';

const PRODUCT_COLUMNS =
  'id, shop_id, category_id, name, description, price, unit, image_url, stock_quantity, low_stock_threshold, is_available, created_at, updated_at, categories(id, name)';

export async function getShopProducts(shopId) {
  const { data, error } = await supabase
    .from('shop_items')
    .select(PRODUCT_COLUMNS)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProduct(shopId, payload) {
  const { data, error } = await supabase
    .from('shop_items')
    .insert({
      shop_id: shopId,
      category_id: payload.categoryId || null,
      name: payload.name,
      description: payload.description || null,
      price: payload.price,
      unit: payload.unit || null,
      image_url: payload.imageUrl || null,
      stock_quantity: payload.stockQuantity,
      low_stock_threshold: payload.lowStockThreshold,
      is_available: payload.isAvailable,
    })
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(productId, payload) {
  const { data, error } = await supabase
    .from('shop_items')
    .update({
      category_id: payload.categoryId || null,
      name: payload.name,
      description: payload.description || null,
      price: payload.price,
      unit: payload.unit || null,
      ...(payload.imageUrl !== undefined ? { image_url: payload.imageUrl } : {}),
      stock_quantity: payload.stockQuantity,
      low_stock_threshold: payload.lowStockThreshold,
      is_available: payload.isAvailable,
    })
    .eq('id', productId)
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase.from('shop_items').delete().eq('id', productId);
  if (error) throw error;
}

export async function toggleAvailability(productId, isAvailable) {
  const { data, error } = await supabase
    .from('shop_items')
    .update({ is_available: isAvailable })
    .eq('id', productId)
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Stock is set directly by the shopkeeper here (not via create_order, which
 * only decrements/restores it during checkout). The DB CHECK (stock >= 0)
 * is the authoritative guard; we also block negative values client-side
 * for immediate feedback.
 */
export async function updateStock(productId, stockQuantity) {
  if (stockQuantity < 0) throw new Error('Stock cannot be negative.');
  const { data, error } = await supabase
    .from('shop_items')
    .update({ stock_quantity: stockQuantity })
    .eq('id', productId)
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function uploadProductImage(shopId, file) {
  const ext = file.name.split('.').pop();
  const path = `${shopId}/product-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
