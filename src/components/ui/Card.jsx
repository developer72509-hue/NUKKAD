import { clsx } from '../../utils/clsx';

export default function Card({ className, children, as: Tag = 'div', interactive = false, ...props }) {
  return (
    <Tag
      className={clsx(
        'rounded-2xl border border-ink-100 bg-white shadow-sm',
        interactive && 'hover-lift transition-shadow hover:border-brand-100 hover:shadow-float',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
