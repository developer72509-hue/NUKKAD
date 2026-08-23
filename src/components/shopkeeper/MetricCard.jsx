import Card from '../ui/Card';

export default function MetricCard({ label, value, icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-500">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-ink-300" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-2xl font-bold text-ink-900">{value}</p>
    </Card>
  );
}
