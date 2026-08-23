import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, ChevronRight, ShoppingBag } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { getMyOrders } from '../../services/orderService';

const STATUS_STYLES = {
  PLACED: 'bg-brand-50 text-brand-600',
  ACCEPTED: 'bg-brand-50 text-brand-600',
  PREPARING: 'bg-brand-50 text-brand-600',
  READY: 'bg-brand-50 text-brand-600',
  DELIVERED: 'bg-success-500/10 text-success-500',
  REJECTED: 'bg-danger-500/10 text-danger-500',
  CANCELLED: 'bg-ink-200 text-ink-600',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container-app max-w-2xl py-6">
      <h1 className="text-2xl font-bold text-ink-900">Your orders</h1>

      <div className="mt-4">
        {loading ? (
          <LoadingState label="Loading orders…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            message="Your order history will show up here once you place your first order."
            action={
              <Button as={Link} to="/shops" size="sm">
                Browse shops
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="block focus-ring rounded-2xl">
                <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
                  {order.shops?.logo_url ? (
                    <img
                      src={order.shops.logo_url}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50">
                      <Store className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {order.shops?.name ?? 'Shop'}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[order.status] ?? 'bg-ink-100 text-ink-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-xs text-ink-500">
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="font-medium text-ink-700">₹{order.total}</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
