import { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, MapPin, Package } from 'lucide-react';
import Card from '../ui/Card';
import LocationMap from '../ui/LocationMap';
import OrderStatusActions from './OrderStatusActions';
import { getShopOrderItems } from '../../services/orderService';
import { clsx } from '../../utils/clsx';
import { maskPhone, shouldShowFullNumber } from '../../utils/phone';

const STATUS_STYLES = {
  PLACED: 'bg-brand-50 text-brand-600',
  ACCEPTED: 'bg-brand-50 text-brand-600',
  PREPARING: 'bg-brand-50 text-brand-600',
  READY: 'bg-brand-50 text-brand-600',
  DELIVERED: 'bg-success-500/10 text-success-500',
  REJECTED: 'bg-danger-500/10 text-danger-500',
  CANCELLED: 'bg-ink-200 text-ink-600',
};

export default function ShopOrderCard({ order, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const showFullNumber = shouldShowFullNumber(order.status);

  async function toggleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && items === null) {
      setItemsLoading(true);
      setItemsError('');
      try {
        const data = await getShopOrderItems(order.id);
        setItems(data);
      } catch (err) {
        setItemsError(err.message);
      } finally {
        setItemsLoading(false);
      }
    }
  }

  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={toggleExpand}
        className="flex w-full items-center justify-between gap-3 text-left focus-ring rounded-lg"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-900">
              #{order.id.slice(0, 8)}
            </span>
            <span
              className={clsx(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                STATUS_STYLES[order.status] ?? 'bg-ink-100 text-ink-600'
              )}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">
            {new Date(order.created_at).toLocaleString()} · ₹{order.total}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 flex flex-col gap-4 border-t border-ink-100 pt-4">
          <div className="flex items-start gap-2 text-sm text-ink-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
            {order.delivery_address_snapshot}
          </div>
          <LocationMap
            latitude={order.delivery_latitude}
            longitude={order.delivery_longitude}
            height={160}
          />
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Phone className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
            {showFullNumber ? (
              <a href={`tel:${order.delivery_phone}`} className="hover:underline">
                {order.delivery_phone}
              </a>
            ) : (
              <span className="text-ink-400" title="Customer number hidden after delivery">
                {maskPhone(order.delivery_phone)}
              </span>
            )}
          </div>

          {itemsLoading ? (
            <p className="text-sm text-ink-400">Loading items…</p>
          ) : itemsError ? (
            <p className="text-sm text-danger-500">{itemsError}</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {items?.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm text-ink-700">
                  <Package className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  <span className="flex-1">{item.item_name_snapshot}</span>
                  <span className="text-ink-500">
                    {item.quantity} × ₹{item.unit_price_snapshot}
                  </span>
                  <span className="font-medium text-ink-900">₹{item.line_total}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between border-t border-ink-100 pt-3 text-sm font-medium text-ink-900">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>

          <OrderStatusActions
            status={order.status}
            onUpdate={(next) => onStatusUpdate(order.id, next)}
          />
        </div>
      )}
    </Card>
  );
}
