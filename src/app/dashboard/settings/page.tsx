import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreSettings } from "@/components/dashboard/store-settings";
import { PageHeader } from "@/components/ui/page-header";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="تنظیمات"
        description="اطلاعات فروشگاه، رنگ، لوگو و محتوای صفحه اصلی را مدیریت کنید"
      />
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
