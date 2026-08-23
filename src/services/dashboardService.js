import { supabase } from '../lib/supabaseClient';

const PENDING_STATUSES = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getDashboardMetrics(shopId) {
  const todayStart = startOfToday();

  const [todayCount, pendingCount, deliveredCount, todayOrders, recentCustomers] =
    await Promise.all([
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('shop_id', shopId)
        .gte('created_at', todayStart),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('shop_id', shopId)
        .in('status', PENDING_STATUSES),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('shop_id', shopId)
        .eq('status', 'DELIVERED'),
      supabase
        .from('orders')
        .select('total, status')
        .eq('shop_id', shopId)
        .gte('created_at', todayStart),
      supabase
        .from('orders')
        .select('customer_id')
        .eq('shop_id', shopId)
        .limit(500),
    ]);

  for (const r of [todayCount, pendingCount, deliveredCount, todayOrders, recentCustomers]) {
    if (r.error) throw r.error;
  }

  const todaySales = todayOrders.data
    .filter((o) => o.status !== 'REJECTED' && o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const totalCustomers = new Set(recentCustomers.data.map((o) => o.customer_id)).size;

  return {
    todayOrders: todayCount.count ?? 0,
    pendingOrders: pendingCount.count ?? 0,
    completedOrders: deliveredCount.count ?? 0,
    todaySales,
    totalCustomers,
  };
}

export async function getRecentOrders(shopId, limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, created_at')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getLowStockProducts(shopId, limit = 5) {
  const { data, error } = await supabase
    .from('shop_items')
    .select('id, name, stock_quantity, low_stock_threshold, image_url')
    .eq('shop_id', shopId)
    .order('stock_quantity', { ascending: true });
  if (error) throw error;
  return data.filter((p) => p.stock_quantity <= p.low_stock_threshold).slice(0, limit);
}
