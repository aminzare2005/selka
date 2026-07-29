import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

export default function GalleryLoading() {
  return (
    <>
      <PageHeader {...dashboardPageMeta.gallery} />
      <div className="mt-6 space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <GallerySkeleton />
      </div>
    </>
  );
}
