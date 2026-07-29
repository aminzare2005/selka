import { ProductListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default function ProductsLoading() {
  return (
    <>
      <PageHeader {...dashboardPageMeta.products} />
      <div className="mt-6">
        <ProductListSkeleton />
      </div>
    </>
  );
}
