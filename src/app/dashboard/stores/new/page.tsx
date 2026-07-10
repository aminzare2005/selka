import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { NewStoreForm } from "@/components/dashboard/new-store-form";
import { AppShell } from "@/components/layout/app-shell";
import { buildDashboardSections, dashboardNavItems } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";

export default async function NewStorePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AppShell user={session.user} sections={buildDashboardSections(dashboardNavItems)}>
      <PageHeader title="فروشگاه جدید" description="نام و آدرس فروشگاه خود را وارد کنید" />
      <div className="mt-8 max-w-lg">
        <NewStoreForm />
      </div>
    </AppShell>
  );
}
