import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import ShopCard from '../../components/marketplace/ShopCard';
import { getFavoriteShops } from '../../services/favoritesService';
import { useFavorites } from '../../hooks/useFavorites';

export default function Favourites() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favoriteIds } = useFavorites();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavoriteShops();
      setShops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the list in sync if a shop is unfavourited from this same page (via ShopCard's heart button).
  useEffect(() => {
    setShops((prev) => prev.filter((s) => favoriteIds.has(s.id)));
  }, [favoriteIds]);

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold text-ink-900">Favourite shops</h1>

      <div className="mt-4">
        {loading ? (
          <LoadingState label="Loading favourites…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : shops.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            message="Tap the heart on any shop to save it here."
            action={
              <Button as={Link} to="/shops" size="sm">
                Browse shops
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
