import { supabase } from '../lib/supabaseClient';

/**
 * items: [{ item_id, quantity }] — price/stock are re-validated and
 * snapshotted server-side inside create_order(); nothing from the client
 * is trusted for pricing or totals.
 */
export async function placeOrder({ shopId, addressId, items }) {
  const { data, error } = await supabase.rpc('create_order', {
    p_shop_id: shopId,
    p_address_id: addressId,
    p_items: items,
  });
  if (error) throw error;
  return data; // order id
}

const ORDER_LIST_COLUMNS =
  'id, status, subtotal, delivery_fee, total, created_at, shop_id, shops(name, logo_url)';

const ORDER_DETAIL_COLUMNS =
  'id, customer_id, shop_id, address_id, status, subtotal, delivery_fee, total, payment_method, delivery_phone, delivery_address_snapshot, delivery_pincode_snapshot, delivery_latitude, delivery_longitude, created_at, updated_at, shops(name, phone, logo_url, address_line)';

/**
 * RLS restricts this to the authenticated customer's own orders
 * (orders_select_customer policy) — no explicit customer_id filter needed,
 * but ordering/limit keeps the query cheap.
 */
export async function getMyOrders({ limit = 30 } = {}) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/**
 * Used to decide whether a shop's phone number should be revealed on its
 * profile page — only once the customer has an order with that shop that
 * hasn't been delivered/cancelled/rejected yet. RLS already scopes this to
 * the caller's own orders.
 */
export async function hasActiveOrderWithShop(shopId) {
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('shop_id', shopId)
    .not('status', 'in', '(DELIVERED,CANCELLED,REJECTED)')
    .limit(1);
  if (error) throw error;
  return Boolean(data?.length);
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_DETAIL_COLUMNS)
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('id, item_id, item_name_snapshot, unit_price_snapshot, quantity, line_total')
    .eq('order_id', orderId)
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Status changes go exclusively through the secure RPC — it validates the
 * transition server-side (PLACED→CANCELLED only for customers) and
 * restores stock; the frontend never writes orders.status directly.
 */
export async function cancelOrder(orderId) {
  const { error } = await supabase.rpc('update_order_status', {
    p_order_id: orderId,
    p_new_status: 'CANCELLED',
  });
  if (error) throw error;
}

export function subscribeToOrder(orderId, onChange) {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      (payload) => onChange(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * RLS (orders_select_shopkeeper) restricts this to orders whose shop is
 * owned by the caller — no explicit shop_id filter needed for correctness,
 * but passing it keeps the query index-friendly.
 */
export async function getShopOrders(shopId, { status, limit = 50 } = {}) {
  let query = supabase
    .from('orders')
    .select(
      'id, status, subtotal, delivery_fee, total, delivery_phone, delivery_address_snapshot, delivery_latitude, delivery_longitude, created_at, updated_at, customer_id'
    )
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getShopOrderItems(orderId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('id, item_id, item_name_snapshot, unit_price_snapshot, quantity, line_total')
    .eq('order_id', orderId);
  if (error) throw error;
  return data;
}

/**
 * Same secure RPC as customer cancellation — server-side validates the
 * transition map per role (shopkeeper can ACCEPT/REJECT/PREPARING/READY/
 * DELIVERED; customer can only CANCEL from PLACED).
 */
export async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabase.rpc('update_order_status', {
    p_order_id: orderId,
    p_new_status: newStatus,
  });
  if (error) throw error;
}

export function subscribeToShopOrders(shopId, onChange) {
  const channel = supabase
    .channel(`shop-orders-${shopId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `shop_id=eq.${shopId}` },
      onChange
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
