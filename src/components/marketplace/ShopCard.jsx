import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Store, Heart } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { isShopOpenNow } from '../../utils/shopStatus';

export default function ShopCard({ shop }) {
  const categoryName = shop.categories?.name;
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const favorite = isFavorite(shop.id);
  const openNow = isShopOpenNow(shop);

  async function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(shop.id);
    } catch {
      // toggleFavorite already rolled back optimistic state; nothing further to do here.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link to={`/shops/${shop.id}`} className="block focus-ring rounded-2xl">
      <Card interactive className="group overflow-hidden p-0">
        <div className="relative h-32 w-full gradient-brand-soft">
          {shop.cover_image_url ? (
            <img
              src={shop.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Store className="h-8 w-8 text-ink-300" aria-hidden="true" />
            </div>
          )}
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm ${
              openNow
                ? 'bg-success-500/90 text-white'
                : 'bg-ink-800/80 text-white'
            }`}
          >
            {openNow ? 'Open' : 'Closed'}
          </span>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={favorite}
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-sm transition-colors hover:bg-white focus-ring disabled:opacity-60"
            disabled={busy}
          >
            <Heart
              className={favorite ? 'h-4 w-4 fill-danger-500 text-danger-500' : 'h-4 w-4'}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="flex items-start gap-3 p-3.5">
          {shop.logo_url ? (
            <img
              src={shop.logo_url}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-ink-100 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
              <Store className="h-5 w-5 text-brand-500" aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-ink-900">{shop.name}</h3>
            <p className="truncate text-xs text-ink-500">
              {[categoryName, shop.address_line].filter(Boolean).join(' • ')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-ink-100 px-3.5 py-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" aria-hidden="true" />
            <span className="text-xs font-medium text-ink-700">
              {Number(shop.rating_avg ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-ink-400">({shop.rating_count ?? 0})</span>
            {shop.distance_km != null && (
              <span className="ml-1 text-xs text-ink-400">
                · {shop.distance_km < 1 ? `${Math.round(shop.distance_km * 1000)} m` : `${shop.distance_km.toFixed(1)} km`}
              </span>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-600">
            View Shop
          </span>
        </div>
      </Card>
    </Link>
  );
}
