import { clsx } from '../../utils/clsx';

export default function Skeleton({ className }) {
  return <div className={clsx('animate-pulse rounded-lg bg-ink-100', className)} />;
}
