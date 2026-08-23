import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Logo({ className = '' }) {
  const { role } = useAuth();
  const home = role === 'shopkeeper' ? '/shopkeeper' : '/';

  return (
    <Link
      to={home}
      className={`inline-flex items-center gap-2 focus-ring rounded-lg ${className}`}
      aria-label="NUKKAD home"
    >
      <span className="gradient-brand shadow-float flex h-9 w-9 items-center justify-center rounded-xl text-white">
        <Store className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink-900">
        NUK<span className="gradient-text">KAD</span>
      </span>
    </Link>
  );
}
