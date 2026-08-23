import {
  Home,
  ShoppingBasket,
  Carrot,
  Milk,
  Beef,
  Pill,
  Pencil,
  Monitor,
  Store,
} from 'lucide-react';
import { clsx } from '../../utils/clsx';

// Best-effort icon match by category name so the pills read visually like the
// reference design, without needing a new icon field in the categories table.
const ICON_RULES = [
  [/veg|fruit|produce/i, Carrot],
  [/dairy|bakery|bread|milk/i, Milk],
  [/meat|fish|chicken|mutton/i, Beef],
  [/pharma|medic|health/i, Pill],
  [/station|book|office/i, Pencil],
  [/electronic|mobile|gadget/i, Monitor],
  [/grocery|kirana/i, ShoppingBasket],
  [/general|super\s?market|store/i, Store],
];

function iconForCategory(name = '') {
  const match = ICON_RULES.find(([pattern]) => pattern.test(name));
  return match ? match[1] : Store;
}

export default function CategoryPills({ categories, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={clsx(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all press-scale focus-ring',
          !activeId
            ? 'bg-brand-500 text-white shadow-float'
            : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
        )}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        All
      </button>
      {categories.map((cat) => {
        const Icon = iconForCategory(cat.name);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={clsx(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all press-scale focus-ring',
              activeId === cat.id
                ? 'bg-brand-500 text-white shadow-float'
                : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
