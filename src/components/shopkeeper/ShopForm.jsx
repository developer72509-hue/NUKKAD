import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LocationMap from '../ui/LocationMap';
import { isValidIndianPhone, normalizeIndianPhone } from '../../utils/phone';

export default function ShopForm({ initial, initialCategoryIds, categories, onSubmit, submitting, submitLabel = 'Save shop' }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    categoryIds: initialCategoryIds?.length
      ? initialCategoryIds
      : initial?.category_id
      ? [initial.category_id]
      : [],
    phone: initial?.phone ?? '',
    addressLine: initial?.address_line ?? '',
    pincode: initial?.pincode ?? '',
    latitude: initial?.latitude ?? '',
    longitude: initial?.longitude ?? '',
    openingTime: initial?.opening_time?.slice(0, 5) ?? '09:00',
    closingTime: initial?.closing_time?.slice(0, 5) ?? '21:00',
    gstin: initial?.gstin ?? '',
    gstNotApplicable: initial?.gstin ? false : (initial?.gst_not_applicable ?? false),
    sellerDeclaration: Boolean(initial?.seller_declaration_at),
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
        setLocationError('Could not get your location. Enter it manually below.');
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 0 }
    );
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Shop name is required';
    if (!isValidIndianPhone(form.phone)) next.phone = 'Enter a valid 10-digit phone number';
    if (!form.addressLine.trim()) next.addressLine = 'Address is required';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode';
    if (form.categoryIds.length === 0) next.categoryIds = 'Select at least one category';
    if (form.latitude === '' || form.longitude === '')
      next.location = 'Add your shop location using GPS or enter coordinates manually';
    if (!form.gstNotApplicable) {
      const gstin = form.gstin.trim().toUpperCase();
      if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
        next.gstin = 'Enter a valid 15-character GSTIN, or mark "Not applicable"';
      }
    }
    if (!form.sellerDeclaration) {
      next.sellerDeclaration =
        'Please confirm the seller declaration to continue';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (import.meta.env.DEV) console.log('[ShopForm] submit fired', { latitude: form.latitude, longitude: form.longitude });
    const valid = validate();
    if (import.meta.env.DEV) console.log('[ShopForm] validate() result', valid);
    if (!valid) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryIds[0],
      categoryIds: form.categoryIds,
      phone: normalizeIndianPhone(form.phone) ?? form.phone.trim(),
      addressLine: form.addressLine.trim(),
      pincode: form.pincode.trim(),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      openingTime: form.openingTime,
      closingTime: form.closingTime,
      gstin: form.gstNotApplicable ? null : form.gstin.trim().toUpperCase(),
      gstNotApplicable: form.gstNotApplicable,
      sellerDeclarationAccepted: form.sellerDeclaration,
    };
    if (import.meta.env.DEV) console.log('[ShopForm] calling onSubmit with payload', payload);
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Shop name"
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-800">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus-ring focus:border-brand-500"
          placeholder="Tell customers what your shop offers"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-800">
          Categories <span className="font-normal text-ink-400">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const checked = form.categoryIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    categoryIds: checked
                      ? f.categoryIds.filter((id) => id !== c.id)
                      : [...f.categoryIds, c.id],
                  }))
                }
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-ring ${
                  checked
                    ? 'bg-brand-500 text-white'
                    : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-400">
          The first category picked is used as your shop's primary listing category.
        </p>
        {errors.categoryIds && <p className="text-xs text-danger-500">{errors.categoryIds}</p>}
      </div>

      <Input
        label="Phone"
        name="phone"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        error={errors.phone}
      />

      <Input
        label="Address"
        name="addressLine"
        value={form.addressLine}
        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
        error={errors.addressLine}
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
        <Button type="button" variant="outline" size="sm" loading={locating} onClick={useCurrentLocation}>
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Opening time"
          type="time"
          value={form.openingTime}
          onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
        />
        <Input
          label="Closing time"
          type="time"
          value={form.closingTime}
          onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          label="GSTIN"
          name="gstin"
          value={form.gstin}
          disabled={form.gstNotApplicable}
          maxLength={15}
          placeholder="e.g. 22AAAAA0000A1Z5"
          onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
          error={errors.gstin}
        />
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={form.gstNotApplicable}
            onChange={(e) =>
              setForm({ ...form, gstNotApplicable: e.target.checked, gstin: '' })
            }
            className="h-4 w-4 rounded border-ink-300 text-brand-500 focus-ring"
          />
          GST registration is not applicable / I'm not registered
        </label>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border border-ink-200 bg-ink-50 p-3.5">
        <label className="flex items-start gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.sellerDeclaration}
            onChange={(e) => setForm({ ...form, sellerDeclaration: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus-ring"
          />
          <span>
            I confirm the information above is accurate, that the products I sell are genuine
            and legally sellable, and that I'm responsible for the accuracy of my product
            listings and images. I agree to NUKKAD's{' '}
            <a href="/seller-terms" target="_blank" rel="noreferrer" className="text-brand-600 underline">
              Seller Terms
            </a>{' '}
            and{' '}
            <a href="/prohibited-products" target="_blank" rel="noreferrer" className="text-brand-600 underline">
              Prohibited Products Policy
            </a>
            .
          </span>
        </label>
        {errors.sellerDeclaration && (
          <p className="text-xs text-danger-500">{errors.sellerDeclaration}</p>
        )}
      </div>

      <Button type="submit" loading={submitting} className="mt-2 w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
