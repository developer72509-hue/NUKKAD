import { useState } from 'react';
import { Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { clsx } from '../../utils/clsx';

export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setError('');
    onSubmit({ rating, comment: comment.trim() });
  }

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-ink-900">Rate your order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              className="focus-ring rounded"
            >
              <Star
                className={clsx(
                  'h-7 w-7 transition-colors',
                  n <= (hoverRating || rating)
                    ? 'fill-warning-500 text-warning-500'
                    : 'text-ink-200'
                )}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)"
          className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus-ring focus:border-brand-500"
        />

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <Button type="submit" loading={submitting} size="sm">
          Submit review
        </Button>
      </form>
    </Card>
  );
}
