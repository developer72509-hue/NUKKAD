import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import { useAuth } from '../../hooks/useAuth';
import { useAddresses } from '../../hooks/useAddresses';

export default function Addresses() {
  const { user } = useAuth();
  const routeLocation = useLocation();
  const { addresses, loading, error, reload, create, update, remove, makeDefault } = useAddresses(
    user?.id
  );
  const [formOpen, setFormOpen] = useState(Boolean(routeLocation.state?.openForm));
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  function openCreate() {
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEdit(address) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  async function handleSubmit(payload) {
    if (submitting) return;
    setSubmitting(true);
    setActionError('');
    try {
      if (editingAddress) {
        await update(editingAddress.id, payload);
      } else {
        await create(payload);
      }
      setFormOpen(false);
      setEditingAddress(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this address?')) return;
    try {
      await remove(id);
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div className="container-app max-w-xl py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Your addresses</h1>
        {!formOpen && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        )}
      </div>

      {actionError && (
        <p className="mt-3 rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-500">
          {actionError}
        </p>
      )}

      {formOpen && (
        <Card className="mt-4 p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            {editingAddress ? 'Edit address' : 'New address'}
          </h2>
          <AddressForm
            initial={editingAddress}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditingAddress(null);
            }}
          />
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState label="Loading addresses…" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : addresses.length === 0 && !formOpen ? (
          <EmptyState
            title="No saved addresses"
            message="Add an address to speed up checkout."
            action={
              <Button size="sm" onClick={openCreate}>
                Add address
              </Button>
            }
          />
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={() => openEdit(addr)}
              onDelete={() => handleDelete(addr.id)}
              onSetDefault={() => makeDefault(addr.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
