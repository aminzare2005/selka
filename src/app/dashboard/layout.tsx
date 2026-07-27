import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { AppShell } from "@/components/layout/app-shell";
import {
  buildDashboardSections,
  dashboardNavItems,
  type NavItem,
} from "@/components/layout/dashboard-nav";
import { StoreProvider } from "@/components/dashboard/store-context";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);

  const extraItems: NavItem[] =
    session.user.role === "PLATFORM_ADMIN"
      ? [{ href: "/admin", label: "پنل ادمین", icon: <Shield className="h-4 w-4" /> }]
      : [];

  const sections = buildDashboardSections(dashboardNavItems, extraItems);

  return (
    <AppShell user={session.user} sections={sections}>
      <StoreProvider store={store}>{children}</StoreProvider>
    </AppShell>
  );
}
