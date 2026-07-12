import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { buildDashboardSections, dashboardNavItems, type NavItem } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";
import { CreateStoreSheet } from "@/components/dashboard/create-store-sheet";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const navItems: NavItem[] =
    session.user.role === "PLATFORM_ADMIN"
      ? [...dashboardNavItems, { href: "/admin", label: "پنل ادمین", icon: <Shield className="h-4 w-4" /> }]
      : dashboardNavItems;

  return (
    <AppShell user={session.user} sections={buildDashboardSections(navItems)}>
      <PageHeader
        title="داشبورد"
        description="فروشگاه های خودتو مدیریت کن"
        action={<CreateStoreSheet />}
      />
    </AppShell>
  );
}
