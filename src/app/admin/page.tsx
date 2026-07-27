import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { adminNavItems } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== "PLATFORM_ADMIN") redirect("/dashboard");

  const [users, stores, orders, gateways] = await Promise.all([
    db.user.count(),
    db.store.count(),
    db.order.count(),
    db.paymentGateway.findMany(),
  ]);

  return (
    <AppShell
      user={session.user}
      sections={[{ items: adminNavItems }]}
      brand="سلکا ادمین"
      brandHref="/admin"
    >
      <PageHeader title="پنل ادمین" description="آمار کلی پلتفرم" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "کاربران", value: users },
          { label: "فروشگاه‌ها", value: stores },
          { label: "سفارش‌ها", value: orders },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-4xl font-bold">
                {stat.value.toLocaleString("fa-IR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">درگاه‌های پرداخت</h2>
        <div className="mt-4 space-y-2">
          {gateways.length === 0 ? (
            <p className="text-sm text-muted-foreground">درگاهی ثبت نشده</p>
          ) : (
            gateways.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-caption" dir="ltr">
                    {g.slug}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${g.isActive ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  {g.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
