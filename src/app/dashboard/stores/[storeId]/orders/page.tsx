import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { StoreOrders } from "@/components/dashboard/store-orders";
import { PageHeader } from "@/components/ui/page-header";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreOrdersPage({ params }: Props) {
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
        title="سفارش‌ها"
        description="لیست سفارش‌های دریافتی از این فروشگاه"
      />
      <div className="mt-6">
        <StoreOrders storeId={storeId} />
      </div>
    </div>
  );
}
