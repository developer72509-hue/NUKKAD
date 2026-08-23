import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  IndianRupee,
  Users,
  Star,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import NoShopState from '../../components/shopkeeper/NoShopState';
import MetricCard from '../../components/shopkeeper/MetricCard';
import { useMyShop } from '../../hooks/useMyShop';
import { toggleShopOpen } from '../../services/shopService';
import {
  getDashboardMetrics,
  getRecentOrders,
  getLowStockProducts,
} from '../../services/dashboardService';

const STATUS_STYLES = {
  PLACED: 'bg-brand-50 text-brand-600',
  ACCEPTED: 'bg-brand-50 text-brand-600',
  PREPARING: 'bg-brand-50 text-brand-600',
  READY: 'bg-brand-50 text-brand-600',
  DELIVERED: 'bg-success-500/10 text-success-500',
  REJECTED: 'bg-danger-500/10 text-danger-500',
  CANCELLED: 'bg-ink-200 text-ink-600',
};

export default function Dashboard() {
  const { shop, setShop, loading: shopLoading } = useMyShop();
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingOpen, setTogglingOpen] = useState(false);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [m, orders, low] = await Promise.all([
        getDashboardMetrics(shop.id),
        getRecentOrders(shop.id, 5),
        getLowStockProducts(shop.id, 5),
      ]);
      setMetrics(m);
      setRecentOrders(orders);
      setLowStock(low);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shop?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleOpen() {
    setTogglingOpen(true);
    try {
      const updated = await toggleShopOpen(shop.id, !shop.is_open);
      setShop(updated);
    } finally {
      setTogglingOpen(false);
    }
  }

  if (shopLoading) return <LoadingState label="Loading…" />;
  if (!shop) return <NoShopState />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">{shop.name}</h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              shop.is_open ? 'bg-success-500/10 text-success-500' : 'bg-ink-200 text-ink-600'
            }`}
          >
            {shop.is_open ? 'Open' : 'Closed'}
          </span>
        </div>
        <Button
          size="sm"
          variant={shop.is_open ? 'outline' : 'primary'}
          loading={togglingOpen}
          onClick={handleToggleOpen}
        >
          {shop.is_open ? 'Mark as closed' : 'Mark as open'}
        </Button>
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingState label="Loading dashboard…" />
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Today's orders" value={metrics.todayOrders} icon={ShoppingBag} />
            <MetricCard label="Pending" value={metrics.pendingOrders} icon={Clock} />
            <MetricCard label="Delivered" value={metrics.completedOrders} icon={CheckCircle2} />
            <MetricCard label="Today's sales" value={`₹${metrics.todaySales.toFixed(0)}`} icon={IndianRupee} />
            <MetricCard label="Customers" value={metrics.totalCustomers} icon={Users} />
            <MetricCard
              label="Rating"
              value={`${Number(shop.rating_avg ?? 0).toFixed(1)} (${shop.rating_count ?? 0})`}
              icon={Star}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-900">Recent orders</h2>
                <Link
                  to="/shopkeeper/orders"
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-600 focus-ring rounded"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <EmptyState title="No orders yet" />
              ) : (
                <div className="flex flex-col gap-2">
                  {recentOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-ink-900">#{o.id.slice(0, 8)}</span>
                        <span className="ml-2 text-xs text-ink-400">
                          {new Date(o.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-600">₹{o.total}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            STATUS_STYLES[o.status] ?? 'bg-ink-100 text-ink-600'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-900">Low stock</h2>
                <Link
                  to="/shopkeeper/inventory"
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-600 focus-ring rounded"
                >
                  View inventory <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              {lowStock.length === 0 ? (
                <EmptyState title="All stocked up" message="No products are running low." />
              ) : (
                <div className="flex flex-col gap-2">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="truncate text-ink-800">{p.name}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-500">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {p.stock_quantity} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
