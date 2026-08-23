import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import NoShopState from '../../components/shopkeeper/NoShopState';
import ProductRow from '../../components/shopkeeper/ProductRow';
import { useMyShop } from '../../hooks/useMyShop';
import { getShopProducts, toggleAvailability, updateStock } from '../../services/productService';

export default function Inventory() {
  const { shop, loading: shopLoading } = useMyShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lowStockOnly, setLowStockOnly] = useState(false);

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

  const visible = lowStockOnly
    ? products.filter((p) => p.stock_quantity <= p.low_stock_threshold)
    : products;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900">Inventory</h1>
        <Button
          size="sm"
          variant={lowStockOnly ? 'primary' : 'outline'}
          onClick={() => setLowStockOnly((v) => !v)}
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Low stock only
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState label="Loading inventory…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            message="Add products from the Products page to manage stock here."
            action={
              <Button as={Link} to="/shopkeeper/products" size="sm">
                Go to products
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState title="No low-stock items" message="All your products are well stocked." />
        ) : (
          visible.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onToggleAvailable={handleToggleAvailable}
              onUpdateStock={handleUpdateStock}
            />
          ))
        )}
      </div>
    </div>
  );
}
