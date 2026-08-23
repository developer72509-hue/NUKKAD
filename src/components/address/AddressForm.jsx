import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LocationMap from '../ui/LocationMap';

const LABELS = ['Home', 'Work', 'Other'];

export default function AddressForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    label: initial?.label ?? 'Home',
    addressLine: initial?.address_line ?? '',
    pincode: initial?.pincode ?? '',
    latitude: initial?.latitude ?? '',
    longitude: initial?.longitude ?? '',
    isDefault: initial?.is_default ?? false,
  });
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Location services are not available on this device.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setLocationError('Could not get your location. You can enter it manually below.');
        setLocating(false);
      }
    );
  }

  function validate() {
    const next = {};
    if (!form.addressLine.trim()) next.addressLine = 'Address is required';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode';
    if (form.latitude === '' || form.longitude === '')
      next.location = 'Add your location using GPS or enter coordinates manually';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      label: form.label,
      addressLine: form.addressLine.trim(),
      pincode: form.pincode.trim(),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      isDefault: form.isDefault,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        {LABELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setForm((f) => ({ ...f, label: l }))}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-ring ${
              form.label === l
                ? 'bg-brand-500 text-white'
                : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <Input
        label="Address"
        name="addressLine"
        value={form.addressLine}
        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
        error={errors.addressLine}
        placeholder="House no, street, area"
      />

      <Input
        label="Pincode"
        name="pincode"
        inputMode="numeric"
        maxLength={6}
        value={form.pincode}
        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        error={errors.pincode}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={locating}
          onClick={useCurrentLocation}
        >
          <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          Use current location
        </Button>
        {locationError && <p className="mt-1.5 text-xs text-danger-500">{locationError}</p>}
        {form.latitude !== '' && form.longitude !== '' && (
          <p className="mt-1.5 text-xs text-ink-500">
            Location set ({Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)})
          </p>
        )}
        {errors.location && <p className="mt-1.5 text-xs text-danger-500">{errors.location}</p>}

        <div className="mt-2 grid grid-cols-2 gap-3">
          <Input
            label="Latitude (manual)"
            name="latitude"
            type="number"
            step="any"
            placeholder="e.g. 28.6139"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          />
          <Input
            label="Longitude (manual)"
            name="longitude"
            type="number"
            step="any"
            placeholder="e.g. 77.2090"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <LocationMap latitude={form.latitude} longitude={form.longitude} height={180} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          className="h-4 w-4 rounded border-ink-300 text-brand-500 focus-ring"
        />
        Set as default address
      </label>

      <div className="flex gap-2">
        <Button type="submit" loading={submitting} className="flex-1">
          Save address
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
