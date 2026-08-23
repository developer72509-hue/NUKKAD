import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploadField from './ImageUploadField';

export default function ProductForm({ initial, categories, shopId, onSubmit, onUploadImage, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    categoryId: initial?.category_id ?? '',
    price: initial?.price ?? '',
    unit: initial?.unit ?? '',
    stockQuantity: initial?.stock_quantity ?? 0,
    lowStockThreshold: initial?.low_stock_threshold ?? 5,
    isAvailable: initial?.is_available ?? true,
    imageUrl: initial?.image_url ?? '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (form.stockQuantity < 0) next.stockQuantity = 'Stock cannot be negative';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleImageUpload(file) {
    const url = await onUploadImage(file);
    setForm((f) => ({ ...f, imageUrl: url }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId || null,
      price: Number(form.price),
      unit: form.unit.trim(),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      isAvailable: form.isAvailable,
      imageUrl: form.imageUrl || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ImageUploadField label="Product image" currentUrl={form.imageUrl} onUpload={handleImageUpload} />

      <Input
        label="Product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-800">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus-ring focus:border-brand-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-800">Category</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="h-11 rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 focus-ring focus:border-brand-500"
        >
          <option value="">Uncategorised</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          error={errors.price}
        />
        <Input
          label="Unit"
          placeholder="kg, pc, litre"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Stock quantity"
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          error={errors.stockQuantity}
        />
        <Input
          label="Low-stock alert at"
          type="number"
          min="0"
          value={form.lowStockThreshold}
          onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-ink-300 text-brand-500 focus-ring"
        />
        Available for purchase
      </label>

      <Button type="submit" loading={submitting} className="w-full">
        {initial ? 'Save changes' : 'Add product'}
      </Button>
    </form>
  );
}
