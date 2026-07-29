import { OrderListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default function OrdersLoading() {
  return (
    <>
      <PageHeader {...dashboardPageMeta.orders} />
      <div className="mt-6">
        <OrderListSkeleton />
      </div>
    </>
  );
}
