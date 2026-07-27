import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { StoreThemePicker } from "@/components/dashboard/store-theme-picker";
import { PageHeader } from "@/components/ui/page-header";

export default async function ThemePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);
  if (!store) redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="تم"
        description="ساختار و چیدمان کلی فروشگاه را با انتخاب تم عوض کنید"
      />
      <div className="mt-6 max-w-5xl">
        <StoreThemePicker store={{ id: store.id, themeId: store.themeId }} />
      </div>
    </div>
  );
}
