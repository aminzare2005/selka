import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { StoreGateways } from "@/components/dashboard/store-gateways";
import { PageHeader } from "@/components/ui/page-header";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreGatewaysPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="درگاه‌های پرداخت"
        description="درگاه پرداخت فروشگاه را فعال و تنظیم کنید"
      />
      <div className="mt-6">
        <StoreGateways storeId={storeId} />
      </div>
    </div>
  );
}
