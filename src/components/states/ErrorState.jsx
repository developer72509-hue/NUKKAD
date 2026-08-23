import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-500/10">
        <AlertTriangle className="h-6 w-6 text-danger-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="max-w-xs text-sm text-ink-500">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
