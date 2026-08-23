import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { clsx } from '../../utils/clsx';

export default function ImageUploadField({ label, currentUrl, onUpload, shape = 'square' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl);

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError('');
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message);
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-800">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'relative flex items-center justify-center overflow-hidden border-2 border-dashed border-ink-200 bg-ink-50 text-ink-400 transition-colors hover:border-brand-400 focus-ring',
          shape === 'square' ? 'h-24 w-24 rounded-2xl' : 'h-32 w-full rounded-2xl'
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-6 w-6" aria-hidden="true" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden="true" />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  );
}
