import { GatewayListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";

export default function GatewaysLoading() {
  return (
    <>
      <PageHeader
        title="درگاه‌های پرداخت"
        description="درگاه پرداخت فروشگاه را فعال و تنظیم کنید"
      />
      <div className="mt-6">
        <GatewayListSkeleton />
      </div>
    </>
  );
}
