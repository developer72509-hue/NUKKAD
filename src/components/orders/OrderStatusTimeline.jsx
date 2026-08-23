import { Check, X, Clock } from 'lucide-react';
import { clsx } from '../../utils/clsx';

const HAPPY_PATH = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'];

const LABELS = {
  PLACED: 'Order placed',
  ACCEPTED: 'Accepted by shop',
  PREPARING: 'Preparing your order',
  READY: 'Ready for delivery',
  DELIVERED: 'Delivered',
  REJECTED: 'Order rejected',
  CANCELLED: 'Order cancelled',
};

export default function OrderStatusTimeline({ status, updatedAt }) {
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-danger-500/10 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-500 text-white">
          <X className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900">{LABELS[status]}</p>
          {updatedAt && (
            <p className="text-xs text-ink-500">{new Date(updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = HAPPY_PATH.indexOf(status);

  return (
    <ol className="flex flex-col gap-0">
      {HAPPY_PATH.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const upcoming = i > currentIndex;

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  done && 'bg-success-500 text-white',
                  active && 'bg-brand-500 text-white',
                  upcoming && 'bg-ink-100 text-ink-400'
                )}
              >
                {done ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : active ? (
                  <Clock className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>
              {i < HAPPY_PATH.length - 1 && (
                <div className={clsx('h-8 w-0.5', done ? 'bg-success-500' : 'bg-ink-100')} />
              )}
            </div>
            <div className="pb-6">
              <p
                className={clsx(
                  'text-sm font-medium',
                  active ? 'text-ink-900' : done ? 'text-ink-700' : 'text-ink-400'
                )}
              >
                {LABELS[step]}
              </p>
              {active && updatedAt && (
                <p className="text-xs text-ink-500">{new Date(updatedAt).toLocaleString()}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
