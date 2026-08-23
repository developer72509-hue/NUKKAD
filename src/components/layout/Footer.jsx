import { Link } from 'react-router-dom';
import { Store, Sparkles, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Sparkles, label: 'Fresh Products' },
  { icon: ShieldCheck, label: 'Trusted Local Shops' },
  { icon: Truck, label: 'Fast & Safe Delivery' },
  { icon: HeartHandshake, label: 'Support Your Community' },
];

const COLUMNS = [
  {
    title: 'NUKKAD',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/shops', label: 'Browse shops' },
      { to: '/shopkeeper', label: 'Sell on NUKKAD' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/help', label: 'Help centre' },
      { to: '/contact', label: 'Contact us' },
      { to: '/orders', label: 'Track order' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of service' },
      { to: '/privacy', label: 'Privacy policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-100 bg-ink-900 text-ink-200">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px gradient-brand"
        aria-hidden="true"
      />
      <div className="container-app grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2 focus-ring rounded-lg" aria-label="NUKKAD home">
            <span className="gradient-brand shadow-float flex h-9 w-9 items-center justify-center rounded-xl text-white">
              <Store className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              NUK<span className="gradient-text">KAD</span>
            </span>
          </Link>
          <p className="text-sm text-ink-400">Your Local Market, Online.</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-400 hover:text-white focus-ring rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gradient-brand py-3.5 text-white">
        <div className="container-app flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium sm:text-sm">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-800 py-4">
        <p className="container-app text-center text-xs text-ink-500">
          © {new Date().getFullYear()} NUKKAD. Made for your street, your shops.
        </p>
      </div>
    </footer>
  );
}
