import { useState } from 'react';
import Button from '../ui/Button';

const NEXT_STATUS = {
  PLACED: [
    { value: 'ACCEPTED', label: 'Accept order', variant: 'primary' },
    { value: 'REJECTED', label: 'Reject', variant: 'danger' },
  ],
  ACCEPTED: [{ value: 'PREPARING', label: 'Start preparing', variant: 'primary' }],
  PREPARING: [{ value: 'READY', label: 'Mark ready', variant: 'primary' }],
  READY: [{ value: 'DELIVERED', label: 'Mark delivered', variant: 'primary' }],
};

export default function OrderStatusActions({ status, onUpdate }) {
  const [busyStatus, setBusyStatus] = useState(null);
  const [error, setError] = useState('');
  const actions = NEXT_STATUS[status];

  if (!actions) return null;

  async function handleClick(nextStatus) {
    if (busyStatus) return;
    setBusyStatus(nextStatus);
    setError('');
    try {
      await onUpdate(nextStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyStatus(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {actions.map((a) => (
          <Button
            key={a.value}
            size="sm"
            variant={a.variant}
            loading={busyStatus === a.value}
            disabled={Boolean(busyStatus) && busyStatus !== a.value}
            onClick={() => handleClick(a.value)}
          >
            {a.label}
          </Button>
        ))}
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
