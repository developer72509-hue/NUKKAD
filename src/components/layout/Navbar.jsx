import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { clsx } from '../../utils/clsx';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCustomerLocation } from '../../hooks/useCustomerLocation';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shops', label: 'Shops' },
  { to: '/shops', label: 'Categories' },
  { to: '/favourites', label: 'Favourites' },
  { to: '/orders', label: 'Orders' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { location } = useCustomerLocation();
  const navigate = useNavigate();

  const locationLabel = location?.addressLine
    ? location.addressLine.split(',')[0].trim()
    : 'Set location';

  return (
    <header className="sticky top-0 z-40">
      <div className="h-1.5 gradient-brand" aria-hidden="true" />
      <div className="border-b border-ink-100 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring',
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(
                isAuthenticated ? '/addresses' : '/auth/login',
                isAuthenticated ? { state: { openForm: true } } : undefined
              )
            }
            className="hidden max-w-[160px] items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 focus-ring sm:flex"
          >
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{locationLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>

          <Link
            to="/cart"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            className={clsx(
              'relative flex h-10 items-center justify-center gap-1.5 rounded-full text-ink-700 transition-colors hover:bg-ink-50 focus-ring',
              itemCount > 0 ? 'px-3' : 'w-10'
            )}
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
                  aria-hidden="true"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </span>
            {itemCount > 0 && (
              <span className="hidden text-sm font-semibold text-ink-900 sm:inline">
                ₹{subtotal}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              aria-label="Profile"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-50 focus-ring sm:flex"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to="/auth/login"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-50 focus-ring sm:flex"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-50 focus-ring md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-app flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium focus-ring',
                    isActive ? 'text-brand-600' : 'text-ink-700'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium focus-ring',
                    isActive ? 'text-brand-600' : 'text-ink-700'
                  )
                }
              >
                Profile
              </NavLink>
            ) : (
              <NavLink
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 focus-ring"
              >
                Login / Register
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
