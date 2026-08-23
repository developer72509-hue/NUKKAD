import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <MapPinOff className="h-8 w-8 text-brand-500" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">
        This street doesn't exist on NUKKAD. Let's get you back home.
      </p>
      <Button as={Link} to="/">
        Back to home
      </Button>
    </div>
  );
}
