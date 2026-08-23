import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import NoShopState from '../../components/shopkeeper/NoShopState';
import { useMyShop } from '../../hooks/useMyShop';
import { supabase } from '../../lib/supabaseClient';

async function getShopReviews(shopId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export default function Reviews() {
  const { shop, loading: shopLoading } = useMyShop();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setError(null);
    try {
      setReviews(await getShopReviews(shop.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shop?.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (shopLoading) return <LoadingState label="Loading…" />;
  if (!shop) return <NoShopState />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900">Reviews</h1>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-700">
          <Star className="h-4 w-4 fill-warning-500 text-warning-500" aria-hidden="true" />
          {Number(shop.rating_avg ?? 0).toFixed(1)} ({shop.rating_count ?? 0})
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState label="Loading reviews…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : reviews.length === 0 ? (
          <EmptyState title="No reviews yet" message="Customer reviews will appear here." />
        ) : (
          reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < r.rating ? 'fill-warning-500 text-warning-500' : 'text-ink-200'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              {r.comment && <p className="mt-2 text-sm text-ink-700">{r.comment}</p>}
              <p className="mt-2 text-xs text-ink-400">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
