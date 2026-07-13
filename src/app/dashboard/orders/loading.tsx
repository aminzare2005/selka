import { OrderListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";

export default function OrdersLoading() {
  return (
    <>
      <PageHeader title="سفارش‌ها" description="لیست سفارش‌های دریافتی از این فروشگاه" />
      <div className="mt-6">
        <OrderListSkeleton />
      </div>
    </>
  );
}
