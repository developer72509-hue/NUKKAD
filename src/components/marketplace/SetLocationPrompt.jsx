import { useNavigate } from 'react-router-dom';
import { MapPin, LocateFixed } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function SetLocationPrompt({ locating, locationError, onUseCurrentLocation }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Card className="shadow-float flex flex-col items-center gap-3 p-8 text-center">
      <div className="gradient-brand-soft flex h-14 w-14 items-center justify-center rounded-2xl">
        <MapPin className="h-7 w-7 text-brand-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-ink-900">Set your location to see shops</h3>
      <p className="max-w-xs text-sm text-ink-500">
        We only show shops within 5 km so delivery is fast — share your location to get started.
      </p>

      <div className="flex flex-col items-center gap-2">
        <Button size="sm" onClick={onUseCurrentLocation} loading={locating}>
          <LocateFixed className="h-4 w-4" aria-hidden="true" />
          Use my current location
        </Button>
        {locationError && <p className="max-w-xs text-xs text-danger-500">{locationError}</p>}

        {isAuthenticated ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/addresses', { state: { openForm: true } })}
          >
            Or add a delivery address
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => navigate('/auth/login')}>
            Or log in to save an address
          </Button>
        )}
      </div>
    </Card>
  );
}
