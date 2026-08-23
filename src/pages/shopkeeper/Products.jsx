import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import NoShopState from '../../components/shopkeeper/NoShopState';
import ProductForm from '../../components/shopkeeper/ProductForm';
import ProductRow from '../../components/shopkeeper/ProductRow';
import { useMyShop } from '../../hooks/useMyShop';
import { getCategories } from '../../services/marketplaceService';
import {
  getShopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  updateStock,
  uploadProductImage,
} from '../../services/productService';

export default function Products() {
  const { shop, loading: shopLoading } = useMyShop();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getShopProducts(shop.id);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shop?.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleUploadImage(file) {
    return uploadProductImage(shop.id, file);
  }

  async function handleSubmit(payload) {
    if (submitting) return;
    setSubmitting(true);
    setActionError('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(shop.id, payload);
      }
      setFormOpen(false);
      setEditingProduct(null);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleToggleAvailable(productId, isAvailable) {
    const updated = await toggleAvailability(productId, isAvailable);
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
  }

  async function handleUpdateStock(productId, stockQuantity) {
    const updated = await updateStock(productId, stockQuantity);
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
  }

  if (shopLoading) return <LoadingState label="Loading…" />;
  if (!shop) return <NoShopState />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900">Products</h1>
        {!formOpen && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Button>
        )}
      </div>

      {actionError && (
        <p className="mt-3 rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-500">
          {actionError}
        </p>
      )}

      {formOpen && (
        <Card className="mt-4 p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            {editingProduct ? 'Edit product' : 'New product'}
          </h2>
          <ProductForm
            initial={editingProduct}
            categories={categories}
            shopId={shop.id}
            onSubmit={handleSubmit}
            onUploadImage={handleUploadImage}
            submitting={submitting}
          />
          <button
            type="button"
            onClick={() => {
              setFormOpen(false);
              setEditingProduct(null);
            }}
            className="mt-3 text-sm font-medium text-ink-500 hover:text-ink-800 focus-ring rounded"
          >
            Cancel
          </button>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState label="Loading products…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 && !formOpen ? (
          <EmptyState
            title="No products yet"
            message="Add your first product to start selling on NUKKAD."
            action={
              <Button size="sm" onClick={openCreate}>
                Add product
              </Button>
            }
          />
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => handleDelete(product.id)}
              onToggleAvailable={handleToggleAvailable}
              onUpdateStock={handleUpdateStock}
            />
          ))
        )}
      </div>
    </div>
  );
}
