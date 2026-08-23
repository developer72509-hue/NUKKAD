import { useState } from 'react';
import { Plus, Minus, ShoppingBag, PackageX } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

export default function ProductCard({ product, shop }) {
  const { items, addItem, updateQuantity, shopId, replaceForNewShop } = useCart();
  const inCart = items.find((i) => i.itemId === product.id);
  const [pendingSwitch, setPendingSwitch] = useState(false);

  const outOfStock = !product.is_available || product.stock_quantity <= 0;

  function handleAdd() {
    if (outOfStock) return;
    if (shopId && shopId !== shop.id) {
      setPendingSwitch(true);
      return;
    }
    addItem(product, shop, 1);
  }

  function confirmSwitch() {
    replaceForNewShop(shop, product, 1);
    setPendingSwitch(false);
  }

  return (
    <Card interactive className="flex gap-3 p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl gradient-brand-soft">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-ink-300" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-ink-900">{product.name}</h4>
        {product.description && (
          <p className="line-clamp-1 text-xs text-ink-500">{product.description}</p>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-ink-900">₹{product.price}</span>
          {product.unit && <span className="text-xs text-ink-400">/ {product.unit}</span>}
        </div>

        {outOfStock ? (
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-danger-500">
            <PackageX className="h-3.5 w-3.5" aria-hidden="true" />
            Out of stock
          </div>
        ) : pendingSwitch ? (
          <div className="mt-2 flex flex-col gap-1.5 rounded-lg bg-warning-500/10 p-2 text-xs text-ink-700">
            <span>Your cart has items from another shop. Start a new cart?</span>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={confirmSwitch}>
                Start new cart
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPendingSwitch(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : inCart ? (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 focus-ring"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="w-5 text-center text-sm font-medium">{inCart.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
              disabled={inCart.quantity >= product.stock_quantity}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 focus-ring disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="mt-2" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </Button>
        )}
      </div>
    </Card>
  );
}
