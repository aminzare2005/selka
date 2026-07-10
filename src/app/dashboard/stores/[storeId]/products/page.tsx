import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { StoreProducts } from "@/components/dashboard/store-products";
import { PageHeader } from "@/components/ui/page-header";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreProductsPage({ params }: Props) {
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
        title="محصولات"
        description="افزودن، ویرایش و حذف محصولات فروشگاه"
      />
      <div className="mt-6">
        <StoreProducts storeId={storeId} />
      </div>
    </div>
  );
}
