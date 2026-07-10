import { notFound, redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { StoreDashboardLayout } from "@/components/dashboard/store-dashboard-layout";
import { dashboardNavItems, type NavItem } from "@/components/layout/dashboard-nav";

type Props = {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
};

export default async function StoreLayout({ children, params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
    select: { id: true, name: true, slug: true },
  });

  if (!store) notFound();

  const extraNavItems: NavItem[] | undefined =
    session.user.role === "PLATFORM_ADMIN"
      ? [...dashboardNavItems, { href: "/admin", label: "پنل ادمین", icon: <Shield className="h-4 w-4" /> }]
      : undefined;

  return (
    <StoreDashboardLayout user={session.user} store={store} extraNavItems={extraNavItems}>
      {children}
    </StoreDashboardLayout>
  );
}
