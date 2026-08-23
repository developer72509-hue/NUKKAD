import { MapPin, Pencil, Trash2, Check } from 'lucide-react';
import Card from '../ui/Card';
import { clsx } from '../../utils/clsx';

export default function AddressCard({
  address,
  selectable,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <Card
      className={clsx(
        'flex items-start gap-3 p-4',
        selectable && 'cursor-pointer transition-colors',
        selected && 'border-brand-500 ring-1 ring-brand-500'
      )}
      onClick={selectable ? onSelect : undefined}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100">
        <MapPin className="h-4 w-4 text-ink-500" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-900">{address.label || 'Address'}</span>
          {address.is_default && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
              Default
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-ink-600">{address.address_line}</p>
        <p className="text-xs text-ink-400">{address.pincode}</p>

        <div className="mt-2 flex items-center gap-3 text-xs font-medium">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-800 focus-ring rounded"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="inline-flex items-center gap-1 text-danger-500 hover:underline focus-ring rounded"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
            </button>
          )}
          {onSetDefault && !address.is_default && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault();
              }}
              className="text-brand-600 hover:underline focus-ring rounded"
            >
              Set as default
            </button>
          )}
        </div>
      </div>

      {selectable && selected && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      )}
    </Card>
  );
}
