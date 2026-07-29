import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreSettings } from "@/components/dashboard/store-settings";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader {...dashboardPageMeta.settings} />
      <div className="mt-6">
        <StoreSettings
          store={{
            id: store.id,
            name: store.name,
            slug: store.slug,
            settings: (store.settings ?? {}) as Record<string, unknown>,
          }}
        />
      </div>
    </div>
  );
}
