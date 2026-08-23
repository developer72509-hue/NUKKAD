import { PackageSearch } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  message,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100">
        <Icon className="h-7 w-7 text-ink-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      {message && <p className="max-w-xs text-sm text-ink-500">{message}</p>}
      {action}
    </div>
  );
}
