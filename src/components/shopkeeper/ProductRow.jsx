import { useState } from 'react';
import { Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import { clsx } from '../../utils/clsx';

export default function ProductRow({ product, onEdit, onDelete, onToggleAvailable, onUpdateStock }) {
  const [stockInput, setStockInput] = useState(product.stock_quantity);
  const [savingStock, setSavingStock] = useState(false);
  const [busy, setBusy] = useState(false);

  const lowStock = product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0;
  const outOfStock = product.stock_quantity <= 0;

  async function commitStock() {
    const next = Math.max(0, Number(stockInput) || 0);
    if (next === product.stock_quantity) return;
    setSavingStock(true);
    try {
      await onUpdateStock(product.id, next);
    } finally {
      setSavingStock(false);
    }
  }

  async function handleToggle() {
    setBusy(true);
    try {
      await onToggleAvailable(product.id, !product.is_available);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-100">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-5 w-5 text-ink-300" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-ink-900">{product.name}</h4>
          {(lowStock || outOfStock) && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                outOfStock ? 'bg-danger-500/10 text-danger-500' : 'bg-warning-500/10 text-warning-500'
              )}
            >
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              {outOfStock ? 'Out of stock' : 'Low stock'}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-sm text-ink-600">
          <span className="font-medium">₹{product.price}</span>
          {product.unit && <span className="text-xs text-ink-400">/ {product.unit}</span>}
          {product.categories?.name && (
            <span className="text-xs text-ink-400">· {product.categories.name}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-ink-500">Stock</label>
          <input
            type="number"
            min="0"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            onBlur={commitStock}
            disabled={savingStock}
            className="h-8 w-16 rounded-lg border border-ink-200 px-2 text-sm focus-ring focus:border-brand-500"
          />
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={busy}
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-ring',
            product.is_available
              ? 'bg-success-500/10 text-success-500'
              : 'bg-ink-200 text-ink-600'
          )}
        >
          {product.is_available ? 'Available' : 'Disabled'}
        </button>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit product"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50 focus-ring"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete product"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-danger-500 hover:bg-danger-500/10 focus-ring"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </Card>
  );
}
