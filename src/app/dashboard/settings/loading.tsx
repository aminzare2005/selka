import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default function SettingsLoading() {
  return (
    <>
      <PageHeader {...dashboardPageMeta.settings} />
      <div className="mt-6 max-w-2xl space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="mt-8 h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </>
  );
}
