import { forwardRef } from 'react';
import { clsx } from '../../utils/clsx';

const Input = forwardRef(function Input(
  { label, error, hint, id, className, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'h-11 rounded-xl border bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
          'transition-colors duration-150 focus-ring',
          error ? 'border-danger-500' : 'border-ink-200 focus:border-brand-500',
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger-500">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
