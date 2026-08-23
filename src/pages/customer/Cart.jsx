import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/states/EmptyState';
import ErrorState from '../../components/states/ErrorState';
import { useCart } from '../../hooks/useCart';
import { getShopItemsByIds } from '../../services/marketplaceService';

export default function Cart() {
  const { shopId, shopName, items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [issues, setIssues] = useState([]); // items that changed price/stock/availability

  async function handleProceed() {
    setValidating(true);
    setValidationError(null);
    setIssues([]);

    try {
      const liveItems = await getShopItemsByIds(items.map((i) => i.itemId));
      const liveById = new Map(liveItems.map((i) => [i.id, i]));

      const foundIssues = [];
      for (const cartItem of items) {
        const live = liveById.get(cartItem.itemId);
        if (!live) {
          foundIssues.push({ itemId: cartItem.itemId, name: cartItem.name, reason: 'no longer available' });
          continue;
        }
        if (!live.is_available || live.stock_quantity <= 0) {
          foundIssues.push({ itemId: cartItem.itemId, name: cartItem.name, reason: 'out of stock' });
        } else if (live.stock_quantity < cartItem.quantity) {
          foundIssues.push({
            itemId: cartItem.itemId,
            name: cartItem.name,
            reason: `only ${live.stock_quantity} left`,
          });
        } else if (Number(live.price) !== Number(cartItem.price)) {
          foundIssues.push({
            itemId: cartItem.itemId,
            name: cartItem.name,
            reason: `price changed to ₹${live.price}`,
          });
        }
      }

      if (foundIssues.length > 0) {
        setIssues(foundIssues);
        return;
      }

      navigate('/checkout');
    } catch (err) {
      setValidationError(err.message);
    } finally {
      setValidating(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse shops near you and add products to get started."
          action={
            <Button as={Link} to="/shops" size="sm">
              Browse shops
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-app max-w-2xl py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Your cart</h1>
          {shopName && <p className="text-sm text-ink-500">From {shopName}</p>}
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-danger-500 hover:underline focus-ring rounded"
        >
          Clear cart
        </button>
      </div>

      {issues.length > 0 && (
        <Card className="mt-4 border-warning-500/40 bg-warning-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" aria-hidden="true" />
            <div className="text-sm text-ink-700">
              <p className="font-medium">Some items in your cart have changed:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {issues.map((i) => (
                  <li key={i.itemId}>
                    {i.name} — {i.reason}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-500">
                Update the quantities below or remove these items, then try again.
              </p>
            </div>
          </div>
        </Card>
      )}

      {validationError && (
        <div className="mt-4">
          <ErrorState message={validationError} onRetry={handleProceed} />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.itemId} className="flex items-center gap-3 p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-100">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-ink-300" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-ink-900">{item.name}</h4>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-600">
                <span className="font-medium">₹{item.price}</span>
                {item.unit && <span className="text-xs text-ink-400">/ {item.unit}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 focus-ring"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                aria-label="Increase quantity"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 focus-ring"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.itemId)}
              aria-label={`Remove ${item.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-danger-500/10 hover:text-danger-500 focus-ring"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4">
        <div className="flex items-center justify-between text-sm text-ink-600">
          <span>Subtotal</span>
          <span className="font-medium text-ink-900">₹{subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-400">Delivery fee calculated at checkout</p>

        <Button className="mt-4 w-full" loading={validating} onClick={handleProceed}>
          Proceed to checkout
        </Button>
      </Card>
    </div>
  );
}
