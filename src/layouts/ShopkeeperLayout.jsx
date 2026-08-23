import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Boxes,
  Bell,
  Store,
  Star,
} from 'lucide-react';
import Logo from '../components/layout/Logo';
import { clsx } from '../utils/clsx';

const NAV_ITEMS = [
  { to: '/shopkeeper', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/shopkeeper/orders', label: 'Orders', icon: ClipboardList },
  { to: '/shopkeeper/products', label: 'Products', icon: Package },
  { to: '/shopkeeper/inventory', label: 'Inventory', icon: Boxes },
  { to: '/shopkeeper/notifications', label: 'Notifications', icon: Bell },
  { to: '/shopkeeper/reviews', label: 'Reviews', icon: Star },
  { to: '/shopkeeper/shop', label: 'Shop profile', icon: Store },
];

export default function ShopkeeperLayout() {
  return (
    <div className="flex min-h-dvh bg-ink-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-ink-100 px-5">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-ring',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-50'
                )
              }
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 md:hidden">
          <Logo />
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 flex items-center justify-around border-t border-ink-100 bg-white py-2 safe-bottom md:hidden">
          {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 focus-ring',
                  isActive ? 'text-brand-600' : 'text-ink-500'
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
