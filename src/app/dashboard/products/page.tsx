import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreProducts } from "@/components/dashboard/store-products";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default async function ProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader {...dashboardPageMeta.products} />
      <div className="mt-6">
        <StoreProducts storeId={store.id} storeSlug={store.slug} />
      </div>
    </div>
  );
}
