import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, MapPin, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import EmptyState from '../../components/states/EmptyState';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useAddresses } from '../../hooks/useAddresses';
import { getShopItemsByIds } from '../../services/marketplaceService';
import { placeOrder } from '../../services/orderService';

export default function Checkout() {
  const { user } = useAuth();
  const { shopId, shopName, items, subtotal, clearCart } = useCart();
  const { addresses, loading: addressesLoading, create: createAddress } = useAddresses(user?.id);
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  const [liveItems, setLiveItems] = useState(null);
  const [revalidating, setRevalidating] = useState(true);
  const [revalidationIssues, setRevalidationIssues] = useState([]);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  // Pick the default address once addresses load, if none selected yet.
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  // Re-check price/stock/availability against the live DB right before showing the summary.
  useEffect(() => {
    let active = true;
    if (items.length === 0) {
      setRevalidating(false);
      return;
    }
    setRevalidating(true);
    getShopItemsByIds(items.map((i) => i.itemId))
      .then((live) => {
        if (!active) return;
        const liveById = new Map(live.map((i) => [i.id, i]));
        const issues = [];
        for (const cartItem of items) {
          const l = liveById.get(cartItem.itemId);
          if (!l || !l.is_available || l.stock_quantity <= 0) {
            issues.push(`${cartItem.name} is no longer available`);
          } else if (l.stock_quantity < cartItem.quantity) {
            issues.push(`${cartItem.name}: only ${l.stock_quantity} left`);
          } else if (Number(l.price) !== Number(cartItem.price)) {
            issues.push(`${cartItem.name}: price is now ₹${l.price}`);
          }
        }
        setLiveItems(live);
        setRevalidationIssues(issues);
      })
      .catch((err) => setRevalidationIssues([err.message]))
      .finally(() => active && setRevalidating(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddAddress(payload) {
    if (addressSubmitting) return;
    setAddressSubmitting(true);
    try {
      const created = await createAddress(payload);
      setSelectedAddressId(created.id);
      setAddingAddress(false);
    } catch (err) {
      setPlaceError(err.message);
    } finally {
      setAddressSubmitting(false);
    }
  }

  async function handlePlaceOrder() {
    if (placing) return; // guard against double-submit
    if (!selectedAddressId) {
      setPlaceError('Please select a delivery address.');
      return;
    }
    if (revalidationIssues.length > 0) {
      setPlaceError('Please resolve the cart issues before placing your order.');
      return;
    }

    setPlacing(true);
    setPlaceError('');
    try {
      const orderId = await placeOrder({
        shopId,
        addressId: selectedAddressId,
        items: items.map((i) => ({ item_id: i.itemId, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/orders/${orderId}`, { replace: true });
    } catch (err) {
      setPlaceError(err.message);
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-10">
        <EmptyState
          title="Your cart is empty"
          message="Add products to your cart before checking out."
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
      <h1 className="text-2xl font-bold text-ink-900">Checkout</h1>
      <p className="mt-1 text-sm text-ink-500">From {shopName}</p>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Delivery address</h2>
          {!addingAddress && (
            <button
              type="button"
              onClick={() => setAddingAddress(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 focus-ring rounded"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add new
            </button>
          )}
        </div>

        {addingAddress ? (
          <Card className="p-4">
            <AddressForm
              submitting={addressSubmitting}
              onSubmit={handleAddAddress}
              onCancel={() => setAddingAddress(false)}
            />
          </Card>
        ) : addressesLoading ? (
          <LoadingState label="Loading addresses…" />
        ) : addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No saved address"
            message="Add a delivery address to continue."
            action={
              <Button size="sm" onClick={() => setAddingAddress(true)}>
                Add address
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selectable
                selected={selectedAddressId === addr.id}
                onSelect={() => setSelectedAddressId(addr.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Order summary</h2>

        {revalidating ? (
          <LoadingState label="Checking item availability…" />
        ) : (
          <Card className="p-4">
            {revalidationIssues.length > 0 && (
              <div className="mb-3 flex items-start gap-2 rounded-lg bg-warning-500/10 p-3 text-sm text-ink-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" aria-hidden="true" />
                <div>
                  <p className="font-medium">Please review your cart:</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {revalidationIssues.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                  <Link to="/cart" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline">
                    Edit cart
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 text-sm">
              {items.map((item) => (
                <div key={item.itemId} className="flex justify-between text-ink-600">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-ink-100 pt-3">
              <div className="flex justify-between text-sm text-ink-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-ink-600">
                <span>Delivery fee</span>
                <span>₹0.00</span>
              </div>
              <div className="mt-2 flex justify-between text-base font-semibold text-ink-900">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Payment method</h2>
        <Card className="p-4 text-sm text-ink-700">Cash on Delivery</Card>
      </section>

      {placeError && (
        <p className="mt-4 rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-500">
          {placeError}
        </p>
      )}

      <Button
        className="mt-6 w-full"
        size="lg"
        loading={placing}
        disabled={revalidating || revalidationIssues.length > 0 || !selectedAddressId}
        onClick={handlePlaceOrder}
      >
        Place order
      </Button>
    </div>
  );
}
