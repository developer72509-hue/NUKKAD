import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import ShopForm from '../../components/shopkeeper/ShopForm';
import Logo from '../../components/layout/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useMyShop } from '../../hooks/useMyShop';
import { getCategories } from '../../services/marketplaceService';
import { createShop, setShopCategories } from '../../services/shopService';

export default function Register() {
  const { user } = useAuth();
  const { shop, loading: shopLoading } = useMyShop();
  const navigate = useNavigate();

  if (import.meta.env.DEV) {
    console.log('[ShopRegister] render', { userId: user?.id, shopLoading, shop });
  }

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Already has a shop — no need to register again.
  useEffect(() => {
    if (!shopLoading && shop) {
      navigate('/shopkeeper', { replace: true });
    }
  }, [shop, shopLoading, navigate]);

  async function handleSubmit(payload) {
    if (submitting) return;
    if (import.meta.env.DEV) console.log('[ShopRegister] handleSubmit called', { userId: user?.id, payload });
    setSubmitting(true);
    setSubmitError('');
    try {
      const created = await createShop(user.id, payload);
      if (import.meta.env.DEV) console.log('[ShopRegister] createShop succeeded, row returned:', created);
      if (payload.categoryIds?.length) {
        await setShopCategories(created.id, payload.categoryIds);
      }
      navigate('/shopkeeper', { replace: true });
    } catch (err) {
      if (import.meta.env.DEV) console.error('[ShopRegister] createShop threw:', err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (shopLoading || categoriesLoading) return <LoadingState label="Loading…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="container-app flex h-16 items-center">
        <Logo />
      </div>
      <main className="flex-1 px-4 pb-16">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-ink-900">Set up your shop</h1>
          <p className="mt-1 text-sm text-ink-500">
            Tell customers about your shop — you can add products next.
          </p>

          <Card className="mt-6 p-5">
            {categories.length === 0 ? (
              <p className="text-sm text-ink-500">
                No shop categories are available yet. Please contact NUKKAD support.
              </p>
            ) : (
              <>
                <ShopForm
                  categories={categories}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submitLabel="Create shop"
                />
                {submitError && (
                  <p className="mt-3 text-sm text-danger-500">{submitError}</p>
                )}
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
