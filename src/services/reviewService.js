import { supabase } from '../lib/supabaseClient';

export async function getReviewForOrder(orderId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * RLS (reviews_insert_eligible) enforces DELIVERED status and order
 * ownership server-side; UNIQUE(order_id) prevents a second review for the
 * same order even if this is called twice.
 */
export async function submitReview({ orderId, shopId, customerId, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ order_id: orderId, shop_id: shopId, customer_id: customerId, rating, comment: comment || null })
    .select('id, rating, comment, created_at')
    .single();
  if (error) throw error;
  return data;
}
