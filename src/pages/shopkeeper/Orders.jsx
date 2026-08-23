import { useCallback, useEffect, useState } from 'react';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import NoShopState from '../../components/shopkeeper/NoShopState';
import ShopOrderCard from '../../components/shopkeeper/ShopOrderCard';
import { useMyShop } from '../../hooks/useMyShop';
import { getShopOrders, updateOrderStatus, subscribeToShopOrders } from '../../services/orderService';
import { clsx } from '../../utils/clsx';

const FILTERS = [
  { value: null, label: 'All' },
  { value: 'PLACED', label: 'New' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function Orders() {
  const { shop, loading: shopLoading } = useMyShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getShopOrders(shop.id, { status: filter });
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shop?.id, filter]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime — new orders / status changes reflect without polling.
  useEffect(() => {
    if (!shop?.id) return;
    return subscribeToShopOrders(shop.id, () => load());
  }, [shop?.id, load]);

  async function handleStatusUpdate(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  if (shopLoading) return <LoadingState label="Loading…" />;
  if (!shop) return <NoShopState />;

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900">Orders</h1>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(f.value)}
            className={clsx(
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-ring',
              filter === f.value
                ? 'bg-brand-500 text-white'
                : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState label="Loading orders…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="Orders placed by customers will show up here."
          />
        ) : (
          orders.map((order) => (
            <ShopOrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
