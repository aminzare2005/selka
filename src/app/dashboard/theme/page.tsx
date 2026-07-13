import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreThemeSettings } from "@/components/dashboard/store-theme-settings";
import { PageHeader } from "@/components/ui/page-header";

export default async function ThemePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="تنظیمات تم"
        description="رنگ‌ها، متن‌ها و تم کلی فروشگاه را مدیریت کنید"
      />
      <div className="mt-6 max-w-5xl">
        <StoreThemeSettings
          store={{
            id: store.id,
            slug: store.slug,
            themeId: store.themeId,
            settings: (store.settings ?? {}) as Record<string, unknown>,
          }}
        />
      </div>
    </div>
  );
}
