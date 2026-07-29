import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreOrders } from "@/components/dashboard/store-orders";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader {...dashboardPageMeta.orders} />
      <div className="mt-6">
        <StoreOrders storeId={store.id} />
      </div>
    </div>
  );
}
