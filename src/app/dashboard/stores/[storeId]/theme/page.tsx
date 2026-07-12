import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { StoreThemeSettings } from "@/components/dashboard/store-theme-settings";
import { PageHeader } from "@/components/ui/page-header";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreThemePage({ params }: Props) {
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
