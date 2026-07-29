import { GatewayListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default function GatewaysLoading() {
  return (
    <>
      <PageHeader {...dashboardPageMeta.gateways} />
      <div className="mt-6">
        <GatewayListSkeleton />
      </div>
    </>
  );
}
