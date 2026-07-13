import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreGateways } from "@/components/dashboard/store-gateways";
import { PageHeader } from "@/components/ui/page-header";

export default async function GatewaysPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="درگاه‌های پرداخت"
        description="درگاه پرداخت فروشگاه را فعال و تنظیم کنید"
      />
      <div className="mt-6">
        <StoreGateways storeId={store.id} />
      </div>
    </div>
  );
}
