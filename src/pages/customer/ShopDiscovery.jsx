import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ShopCard from '../../components/marketplace/ShopCard';
import ShopCardSkeleton from '../../components/marketplace/ShopCardSkeleton';
import CategoryPills from '../../components/marketplace/CategoryPills';
import SetLocationPrompt from '../../components/marketplace/SetLocationPrompt';
import EmptyState from '../../components/states/EmptyState';
import ErrorState from '../../components/states/ErrorState';
import { getCategories, getShops } from '../../services/marketplaceService';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useCustomerLocation } from '../../hooks/useCustomerLocation';

export default function ShopDiscovery() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebouncedValue(searchTerm, 350);
  const {
    location,
    loading: locationLoading,
    needsLocation,
    locating,
    locationError,
    requestBrowserLocation,
  } = useCustomerLocation();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  async function loadShops() {
    setLoading(true);
    setError(null);
    try {
      const data = await getShops({
        categoryId: activeCategory,
        search: debouncedSearch || undefined,
        limit: 40,
        // A search is an explicit "find this shop" intent — don't restrict
        // it to nearby results. Browsing without a search still respects
        // the 5 km radius so "shops near you" stays true to its name.
        near: !debouncedSearch && location
          ? { latitude: location.latitude, longitude: location.longitude, radiusKm: 5 }
          : undefined,
      });
      setShops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (locationLoading) return;
    if (needsLocation && !debouncedSearch) return;
    loadShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, debouncedSearch, location?.latitude, location?.longitude, locationLoading, needsLocation]);

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold text-ink-900">Shops near you</h1>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-1.5 shadow-float">
        <Search className="ml-2 h-4 w-4 text-ink-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search shops or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {categories.length > 0 && (
        <div className="mt-4">
          <CategoryPills
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      )}

      <div className="mt-6">
        {needsLocation && !debouncedSearch ? (
          <SetLocationPrompt
            locating={locating}
            locationError={locationError}
            onUseCurrentLocation={requestBrowserLocation}
          />
        ) : loading || locationLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadShops} />
        ) : shops.length === 0 ? (
          <EmptyState
            title="No shops found"
            message={
              debouncedSearch
                ? `No shops match "${debouncedSearch}".`
                : 'No shops available in this category yet.'
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
