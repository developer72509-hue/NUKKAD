import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home as HomeIcon, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/states/EmptyState';
import ErrorState from '../../components/states/ErrorState';
import ShopCard from '../../components/marketplace/ShopCard';
import ShopCardSkeleton from '../../components/marketplace/ShopCardSkeleton';
import CategoryPills from '../../components/marketplace/CategoryPills';
import SetLocationPrompt from '../../components/marketplace/SetLocationPrompt';
import heroStorefront from '../../assets/hero-storefront.png';
import { getCategories, getShops } from '../../services/marketplaceService';
import { useCustomerLocation } from '../../hooks/useCustomerLocation';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location, loading: locationLoading, needsLocation, locating, locationError, requestBrowserLocation } =
    useCustomerLocation();

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {}); // categories are secondary — home still works without them
  }, []);

  async function loadShops() {
    setLoading(true);
    setError(null);
    try {
      const data = await getShops({
        categoryId: activeCategory,
        near: location ? { latitude: location.latitude, longitude: location.longitude, radiusKm: 5 } : undefined,
      });
      setShops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (locationLoading || needsLocation) return;
    loadShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, location?.latitude, location?.longitude, locationLoading, needsLocation]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/shops?q=${encodeURIComponent(searchTerm.trim())}`);
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-100 hero-warm">
        <div className="container-app relative grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200/70 px-3 py-1 text-xs font-medium text-brand-700">
              <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Shop Local &bull; Support Local
            </span>

            <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Your <span className="gradient-text">Local Market</span>, Online.
            </h1>
            <p className="max-w-md text-base text-ink-600">
              Order from the shops on your street — groceries, essentials and
              more, delivered by people you already trust.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full max-w-md items-center gap-2 rounded-xl border border-ink-200 bg-white p-1.5 shadow-float-lg"
            >
              <Search className="ml-2 h-4 w-4 text-ink-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search shops or products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <Button size="sm" type="submit">
                Search
              </Button>
            </form>
          </div>

          <img
            src={heroStorefront}
            alt="Illustration of a row of local shops with striped awnings"
            className="hidden w-full max-w-lg justify-self-end rounded-2xl object-cover shadow-float-lg lg:block"
          />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-app pt-6">
          <CategoryPills
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </section>
      )}

      <section className="container-app py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Shops near you</h2>
          <button
            onClick={() => navigate('/shops')}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 focus-ring rounded"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {needsLocation ? (
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
          <Card className="p-0">
            <ErrorState message={error} onRetry={loadShops} />
          </Card>
        ) : shops.length === 0 ? (
          <Card className="p-0">
            <EmptyState
              title={location ? 'No shops within 5 km' : 'No shops here yet'}
              message={
                location
                  ? "We couldn't find any shops close to your saved address yet."
                  : 'Shops will appear here as they join NUKKAD in your area.'
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
