import { Skeleton } from "@/components/ui/skeleton";

const cardShell = "rounded-2xl border border-border bg-card";

export function StoreCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${cardShell} space-y-4 p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-11 w-36 rounded-full" />
        <Skeleton className="h-4 w-32 self-center" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${cardShell} overflow-hidden`}>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-24" />
              <div className="flex gap-2 border-t border-divider pt-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${cardShell} space-y-4 p-5`}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GatewayListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-24" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${cardShell} overflow-hidden`}>
            <div className="flex gap-3 border-b border-divider p-5">
              <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="flex justify-between p-5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className={`${cardShell} overflow-hidden p-0 shadow-[var(--shadow-card)]`}>
      <div className="lg:grid lg:grid-cols-[1.28fr_1fr]">
        <div className="relative border-b border-divider bg-gradient-to-br from-ocean-100/75 via-card to-brand-50/25 p-6 sm:p-7 lg:border-b-0 lg:border-l lg:px-10 lg:py-10 xl:px-11 xl:py-11">
          <div className="flex items-start justify-between gap-4 lg:gap-6">
            <div className="flex-1 space-y-3 lg:space-y-3.5">
              <Skeleton className="h-4 w-20 lg:h-[0.9375rem] lg:w-24" />
              <Skeleton className="h-10 w-52 lg:h-12 lg:w-60 xl:h-[3.25rem] xl:w-72" />
              <Skeleton className="h-3 w-40 lg:h-[0.8125rem] lg:w-44" />
            </div>
            <Skeleton className="h-12 w-12 shrink-0 rounded-2xl lg:h-14 lg:w-14 lg:rounded-[1.125rem]" />
          </div>
        </div>
        <div className="grid grid-cols-2 auto-rows-fr lg:grid-cols-1 lg:divide-y lg:divide-divider">
          <div className="row-span-2 flex flex-col justify-center gap-2 border-l border-divider p-5 sm:p-6 lg:row-span-1 lg:border-b lg:border-l-0 lg:border-divider lg:px-8 lg:py-7">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <Skeleton className="h-9 w-9 rounded-xl lg:h-8 lg:w-8" />
              <Skeleton className="h-4 w-16 lg:h-[0.8125rem] lg:w-14" />
            </div>
            <Skeleton className="h-8 w-14 lg:h-6 lg:w-12" />
          </div>
          <div className="space-y-2 border-b border-divider p-4 sm:p-5 lg:border-b-0 lg:px-8 lg:py-6">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-3 w-20 lg:h-[0.8125rem] lg:w-[4.5rem]" />
            </div>
            <Skeleton className="h-7 w-10 lg:h-6 lg:w-9" />
          </div>
          <div className="space-y-2 p-4 sm:p-5 lg:px-8 lg:py-6">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-3 w-24 lg:h-[0.8125rem] lg:w-[5.5rem]" />
            </div>
            <Skeleton className="h-7 w-10 lg:h-6 lg:w-9" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <StatsCardsSkeleton />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <StoreCardsSkeleton count={2} />
      </div>
    </div>
  );
}
