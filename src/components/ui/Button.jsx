import { Loader2 } from 'lucide-react';
import { clsx } from '../../utils/clsx';

const VARIANTS = {
  primary:
    'gradient-brand text-white shadow-float hover:brightness-110 hover:shadow-float-lg active:brightness-95',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-700',
  outline: 'border border-ink-200 text-ink-800 hover:bg-ink-50 active:bg-ink-100',
  ghost: 'text-ink-700 hover:bg-ink-100 active:bg-ink-200',
  danger: 'bg-danger-500 text-white hover:brightness-95',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 press-scale',
        'focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
