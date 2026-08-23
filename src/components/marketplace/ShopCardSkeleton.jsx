import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function ShopCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="flex items-start gap-3 p-3.5">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </Card>
  );
}
