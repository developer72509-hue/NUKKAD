import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from '../../services/notificationService';
import { clsx } from '../../utils/clsx';

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyNotifications();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    return subscribeToNotifications(user.id, (n) => setItems((prev) => [n, ...prev]));
  }, [user?.id]);

  async function handleMarkRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await markAsRead(id);
    } catch {
      load(); // resync on failure
    }
  }

  async function handleMarkAll() {
    const prev = items;
    setItems((p) => p.map((n) => ({ ...n, is_read: true })));
    try {
      await markAllAsRead();
    } catch {
      setItems(prev);
    }
  }

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 focus-ring rounded"
          >
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <LoadingState label="Loading notifications…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" />
        ) : (
          items.map((n) => (
            <Card
              key={n.id}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
              className={clsx(
                'flex items-start gap-3 p-3.5',
                !n.is_read && 'cursor-pointer border-brand-200 bg-brand-50/40'
              )}
            >
              <div
                className={clsx(
                  'mt-1 h-2 w-2 shrink-0 rounded-full',
                  n.is_read ? 'bg-transparent' : 'bg-brand-500'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900">{n.title}</p>
                {n.message && <p className="text-sm text-ink-600">{n.message}</p>}
                <p className="mt-0.5 text-xs text-ink-400">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
