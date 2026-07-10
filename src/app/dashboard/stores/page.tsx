import Link from "next/link";
import { redirect } from "next/navigation";
import { Store, Shield } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import {
  buildDashboardSections,
  dashboardNavItems,
  type NavItem,
} from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StoresPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const stores = await db.store.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const navItems: NavItem[] =
    session.user.role === "PLATFORM_ADMIN"
      ? [
          ...dashboardNavItems,
          {
            href: "/admin",
            label: "پنل ادمین",
            icon: <Shield className="h-4 w-4" />,
          },
        ]
      : dashboardNavItems;

  return (
    <AppShell user={session.user} sections={buildDashboardSections(navItems)}>
      <PageHeader
        title="فروشگاه‌ها"
        description="فروشگاه‌های شما"
        action={
          <Button asChild>
            <Link href="/dashboard/stores/new">ساخت فروشگاه</Link>
          </Button>
        }
      />

      {stores.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center animate-slide-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-lg font-semibold">هنوز فروشگاهی ندارید</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            اولین فروشگاه آنلاین خود را بسازید و شروع به فروش کنید.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/stores/new">ساخت فروشگاه</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} variant="interactive">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="mt-1 text-caption" dir="ltr">
                      /s/{store.slug}
                    </p>
                  </div>
                  <Badge
                    variant={
                      store.status === "ACTIVE" ? "success" : "secondary"
                    }
                  >
                    {store.status === "ACTIVE" ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/s/${store.slug}`} target="_blank">
                      مشاهده
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/stores/${store.id}`}>مدیریت</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
