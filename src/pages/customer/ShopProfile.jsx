import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Store, Phone, MapPin, Clock, Heart } from 'lucide-react';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import ProductCard from '../../components/marketplace/ProductCard';
import CategoryPills from '../../components/marketplace/CategoryPills';
import { getShopById, getShopItems, getCategories } from '../../services/marketplaceService';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { isShopOpenNow } from '../../utils/shopStatus';
import { maskPhone } from '../../utils/phone';
import { hasActiveOrderWithShop } from '../../services/orderService';

export default function ShopProfile() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favBusy, setFavBusy] = useState(false);
  const [favError, setFavError] = useState('');
  const [canSeeFullPhone, setCanSeeFullPhone] = useState(false);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    setFavBusy(true);
    setFavError('');
    try {
      await toggleFavorite(shopId);
    } catch (err) {
      setFavError(err.message);
    } finally {
      setFavBusy(false);
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [shopData, productData] = await Promise.all([
        getShopById(shopId),
        getShopItems(shopId),
      ]);
      setShop(shopData);
      setProducts(productData);

      // Number stays masked until this customer has an active order with
      // this shop — no order, no full contact number.
      if (isAuthenticated) {
        hasActiveOrderWithShop(shopId)
          .then(setCanSeeFullPhone)
          .catch(() => setCanSeeFullPhone(false));
      } else {
        setCanSeeFullPhone(false);
      }

      // Only show category filters for categories that actually have products here.
      const usedCategoryIds = new Set(productData.map((p) => p.category_id).filter(Boolean));
      if (usedCategoryIds.size > 0) {
        const allCats = await getCategories();
        setCategories(allCats.filter((c) => usedCategoryIds.has(c.id)));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  if (loading) return <LoadingState label="Loading shop…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!shop) return <EmptyState title="Shop not found" />;

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;
  const openNow = isShopOpenNow(shop);
  const displayPhone = shop.phone && (canSeeFullPhone ? shop.phone : maskPhone(shop.phone));

  return (
    <div>
      <div className="relative h-40 w-full bg-ink-100 sm:h-56">
        {shop.cover_image_url ? (
          <img src={shop.cover_image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Store className="h-10 w-10 text-ink-300" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="container-app -mt-10 pb-10">
        <div className="flex items-end gap-4">
          {shop.logo_url ? (
            <img
              src={shop.logo_url}
              alt=""
              className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-brand-50 shadow-sm">
              <Store className="h-8 w-8 text-brand-500" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">{shop.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              {shop.categories?.name && <span>{shop.categories.name}</span>}
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning-500 text-warning-500" aria-hidden="true" />
                {Number(shop.rating_avg ?? 0).toFixed(1)} ({shop.rating_count ?? 0})
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  openNow ? 'bg-success-500/10 text-success-500' : 'bg-ink-200 text-ink-600'
                }`}
              >
                {openNow ? 'Open now' : 'Closed'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={favBusy}
            aria-pressed={isFavorite(shopId)}
            aria-label={isFavorite(shopId) ? 'Remove from favourites' : 'Add to favourites'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-sm transition-colors hover:bg-ink-50 focus-ring disabled:opacity-60"
          >
            <Heart
              className={isFavorite(shopId) ? 'h-5 w-5 fill-danger-500 text-danger-500' : 'h-5 w-5'}
              aria-hidden="true"
            />
          </button>
        </div>
        {favError && <p className="mt-1 text-xs text-danger-500">{favError}</p>}

        {shop.description && <p className="mt-3 text-sm text-ink-600">{shop.description}</p>}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {shop.address_line}, {shop.pincode}
          </span>
          {shop.phone && (
            canSeeFullPhone ? (
              <a href={`tel:${shop.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink-800">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {displayPhone}
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 text-ink-400"
                title="Visible once you place an order with this shop"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {displayPhone}
              </span>
            )
          )}
          {(shop.opening_time || shop.closing_time) && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {shop.opening_time?.slice(0, 5)} – {shop.closing_time?.slice(0, 5)}
            </span>
          )}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-ink-900">Products</h2>

        {categories.length > 0 && (
          <div className="mt-3">
            <CategoryPills
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
        )}

        <div className="mt-4">
          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              message="This shop hasn't added any products yet."
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState title="No products in this category" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
