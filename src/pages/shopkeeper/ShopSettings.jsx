import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import ShopForm from '../../components/shopkeeper/ShopForm';
import ImageUploadField from '../../components/shopkeeper/ImageUploadField';
import NoShopState from '../../components/shopkeeper/NoShopState';
import TwoFactorSetup from '../../components/account/TwoFactorSetup';
import { useMyShop } from '../../hooks/useMyShop';
import { getCategories } from '../../services/marketplaceService';
import { updateShop, toggleShopOpen, uploadShopImage, getShopCategoryIds, setShopCategories } from '../../services/shopService';

export default function ShopSettings() {
  const { shop, setShop, loading, error, reload } = useMyShop();
  const [categories, setCategories] = useState([]);
  const [shopCategoryIds, setShopCategoryIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [saved, setSaved] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!shop?.id) return;
    getShopCategoryIds(shop.id).then(setShopCategoryIds).catch(() => {});
  }, [shop?.id]);

  async function handleSubmit(payload) {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    setSaved(false);
    try {
      const updated = await updateShop(shop.id, payload);
      if (payload.categoryIds) {
        await setShopCategories(shop.id, payload.categoryIds);
        setShopCategoryIds(payload.categoryIds);
      }
      setShop(updated);
      setSaved(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleOpen() {
    setTogglingOpen(true);
    try {
      const updated = await toggleShopOpen(shop.id, !shop.is_open);
      setShop(updated);
    } catch {
      // silently ignore — status will re-sync on next reload
    } finally {
      setTogglingOpen(false);
    }
  }

  async function handleLogoUpload(file) {
    const url = await uploadShopImage(shop.id, file, 'logo');
    const updated = await updateShop(shop.id, { ...shopToPayload(shop), logoUrl: url });
    setShop(updated);
  }

  async function handleCoverUpload(file) {
    const url = await uploadShopImage(shop.id, file, 'cover');
    const updated = await updateShop(shop.id, { ...shopToPayload(shop), coverImageUrl: url });
    setShop(updated);
  }

  if (loading) return <LoadingState label="Loading shop…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!shop) return <NoShopState />;

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900">Shop profile</h1>
        <Button
          size="sm"
          variant={shop.is_open ? 'outline' : 'primary'}
          loading={togglingOpen}
          onClick={handleToggleOpen}
        >
          {shop.is_open ? 'Mark as closed' : 'Mark as open'}
        </Button>
      </div>

      <Card className="mt-4 p-5">
        <div className="flex gap-4">
          <ImageUploadField label="Logo" currentUrl={shop.logo_url} onUpload={handleLogoUpload} shape="square" />
          <div className="flex-1">
            <ImageUploadField
              label="Cover image"
              currentUrl={shop.cover_image_url}
              onUpload={handleCoverUpload}
              shape="wide"
            />
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <ShopForm
          initial={shop}
          initialCategoryIds={shopCategoryIds}
          categories={categories}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save changes"
        />
        {submitError && <p className="mt-3 text-sm text-danger-500">{submitError}</p>}
        {saved && <p className="mt-3 text-sm text-success-500">Shop profile updated.</p>}
      </Card>

      <TwoFactorSetup />
    </div>
  );
}

function shopToPayload(shop) {
  return {
    name: shop.name,
    description: shop.description,
    categoryId: shop.category_id,
    phone: shop.phone,
    addressLine: shop.address_line,
    pincode: shop.pincode,
    latitude: shop.latitude,
    longitude: shop.longitude,
    openingTime: shop.opening_time,
    closingTime: shop.closing_time,
  };
}
