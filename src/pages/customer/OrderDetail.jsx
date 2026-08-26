import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Phone, MapPin, Package, RefreshCw, Star } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import OrderStatusTimeline from '../../components/orders/OrderStatusTimeline';
import LocationMap from '../../components/ui/LocationMap';
import ReviewForm from '../../components/orders/ReviewForm';
import { useAuth } from '../../hooks/useAuth';
import {
  getOrderById,
  getOrderItems,
  cancelOrder,
  subscribeToOrder,
} from '../../services/orderService';
import { getShopById } from '../../services/marketplaceService';
import { getReviewForOrder, submitReview } from '../../services/reviewService';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [shopPhone, setShopPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderData, itemsData] = await Promise.all([
        getOrderById(orderId),
        getOrderItems(orderId),
      ]);
      setOrder(orderData);
      setItems(itemsData);

      if (orderData && orderData.shop_id) {
        getShopById(orderData.shop_id)
          .then(function (shop) {
            setShopPhone(shop ? { phone: shop.phone, phone_masked: shop.phone_masked } : null);
          })
          .catch(function () {
            setShopPhone(null);
          });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      setOrder((prev) => (prev ? { ...prev, ...updatedOrder } : prev));
    });
    return unsubscribe;
  }, [orderId]);

  useEffect(() => {
    if (!order || order.status !== 'DELIVERED') return;
    setReviewLoading(true);
    getReviewForOrder(orderId)
      .then(setReview)
      .catch(() => {})
      .finally(() => setReviewLoading(false));
  }, [order, orderId]);

  async function handleSubmitReview(payload) {
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const created = await submitReview({
        orderId: orderId,
        shopId: order.shop_id,
        customerId: user.id,
        rating: payload.rating,
        comment: payload.comment,
      });
      setReview(created);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    setCancelError('');
    try {
      await cancelOrder(orderId);
      await load();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <LoadingState label="Loading order..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!order) return <ErrorState title="Order not found" message="This order doesn't exist or isn't yours." />;

  const canCancel = order.status === 'PLACED';
  const showFullNumbers = Boolean(shopPhone && shopPhone.phone) && !(shopPhone && shopPhone.phone_masked);
  const telHref = 'tel:' + (shopPhone ? shopPhone.phone : '');

  return (
    <div className="container-app max-w-2xl py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-ink-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={load}
          aria-label="Refresh order"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 focus-ring"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <Card className="mt-4 p-4">
        <OrderStatusTimeline status={order.status} updatedAt={order.updated_at} />
      </Card>

      {canCancel && (
        <div className="mt-4">
          {cancelError && <p className="mb-2 text-sm text-danger-500">{cancelError}</p>}
          <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel}>
            Cancel order
          </Button>
        </div>
      )}

      <Card className="mt-6 p-4">
        <div className="flex items-center gap-3">
          {order.shops && order.shops.logo_url ? (
            <img src={order.shops.logo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
              <Store className="h-5 w-5 text-brand-500" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{order.shops && order.shops.name}</p>
            {order.shops && order.shops.address_line && (
              <p className="truncate text-xs text-ink-500">{order.shops.address_line}</p>
            )}
          </div>
          {shopPhone && shopPhone.phone && (
            showFullNumbers ? (
              <a
                href={telHref}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 focus-ring"
                aria-label="Call shop"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <span
                className="ml-auto flex items-center gap-1.5 text-xs text-ink-400"
                title="Number hidden after this order was closed"
              >
                {shopPhone.phone}
              </span>
            )
          )}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Items</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 text-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100">
                <Package className="h-4 w-4 text-ink-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ink-900">{item.item_name_snapshot}</p>
                <p className="text-xs text-ink-500">
                  {item.quantity} x Rs.{item.unit_price_snapshot}
                </p>
              </div>
              <span className="font-medium text-ink-900">Rs.{item.line_total}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-ink-100 pt-3 text-sm">
          <div className="flex justify-between text-ink-600">
            <span>Subtotal</span>
            <span>Rs.{order.subtotal}</span>
          </div>
          <div className="mt-1 flex justify-between text-ink-600">
            <span>Delivery fee</span>
            <span>Rs.{order.delivery_fee}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-ink-900">
            <span>Total</span>
            <span>Rs.{order.total}</span>
          </div>
          <div className="mt-2 text-xs text-ink-500">Payment: {order.payment_method}</div>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-2 text-sm font-semibold text-ink-900">Delivery details</h2>
        <div className="flex items-start gap-2 text-sm text-ink-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
          <div>
            <p>{order.delivery_address_snapshot}</p>
            {order.delivery_pincode_snapshot && (
              <p className="text-xs text-ink-400">{order.delivery_pincode_snapshot}</p>
            )}
          </div>
        </div>
        <LocationMap
          latitude={order.delivery_latitude}
          longitude={order.delivery_longitude}
          height={160}
        />
        <div className="mt-2 flex items-center gap-2 text-sm text-ink-600">
          <Phone className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
          {order.delivery_phone}
        </div>
      </Card>

      {order.status === 'DELIVERED' && !reviewLoading && (
        <div className="mt-4">
          {review ? (
            <Card className="p-4">
              <h2 className="mb-2 text-sm font-semibold text-ink-900">Your review</h2>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? 'h-4 w-4 fill-warning-500 text-warning-500'
                        : 'h-4 w-4 text-ink-200'
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              {review.comment && <p className="mt-2 text-sm text-ink-700">{review.comment}</p>}
            </Card>
          ) : (
            <>
              <ReviewForm onSubmit={handleSubmitReview} submitting={reviewSubmitting} />
              {reviewError && <p className="mt-2 text-sm text-danger-500">{reviewError}</p>}
            </>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/orders" className="text-sm font-medium text-brand-600 hover:underline">
          Back to your orders
        </Link>
      </div>
    </div>
  );
}
