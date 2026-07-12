import { StatsCardsSkeleton } from "@/components/ui/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoreOverviewLoading() {
  return (
    <div className="space-y-8">
      <StatsCardsSkeleton count={4} />
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
