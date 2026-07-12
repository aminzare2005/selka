import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  Package,
  Shield,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { buildDashboardSections, dashboardNavItems, type NavItem } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";
import { CreateStoreSheet } from "@/components/dashboard/create-store-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

const orderStatusStyle: Record<string, { dot: string; label: string }> = {
  PAID: { dot: "bg-emerald-500", label: "پرداخت شده" },
  PENDING: { dot: "bg-amber-500", label: "در انتظار" },
  FAILED: { dot: "bg-red-500", label: "ناموفق" },
  CANCELLED: { dot: "bg-neutral-400", label: "لغو شده" },
};

function formatOrderDate(date: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" }).format(new Date(date));
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const navItems: NavItem[] =
    session.user.role === "PLATFORM_ADMIN"
      ? [...dashboardNavItems, { href: "/admin", label: "پنل ادمین", icon: <Shield className="h-4 w-4" /> }]
      : dashboardNavItems;

  const stores = await db.store.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true, orders: true } },
    },
  });

  const storeIds = stores.map((s) => s.id);

  const [totalProducts, paidOrders, pendingOrders, totalRevenue, recentOrders] = await Promise.all([
    db.product.count({ where: { storeId: { in: storeIds } } }),
    db.order.count({ where: { storeId: { in: storeIds }, status: "PAID" } }),
    db.order.count({ where: { storeId: { in: storeIds }, status: "PENDING" } }),
    db.order.aggregate({
      where: { storeId: { in: storeIds }, status: "PAID" },
      _sum: { totalAmount: true },
    }),
    db.order.findMany({
      where: { storeId: { in: storeIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { store: { select: { id: true, name: true } } },
    }),
  ]);

  const revenue = totalRevenue._sum.totalAmount ?? 0;
  const firstName = session.user.name?.split(" ")[0] ?? "کاربر";

  const stats = [
    { label: "فروشگاه‌ها", value: stores.length.toLocaleString("fa-IR"), icon: Store },
    { label: "محصولات", value: totalProducts.toLocaleString("fa-IR"), icon: Package },
    { label: "سفارش موفق", value: paidOrders.toLocaleString("fa-IR"), icon: ShoppingBag },
    { label: "درآمد کل", value: formatPrice(revenue), icon: TrendingUp },
  ];

  const tips = [
    "اولین محصولت رو اضافه کن و لینک فروشگاه رو به مشتری‌ها بفرست.",
    "درگاه پرداخت زیبال رو از بخش درگاه‌ها فعال کن.",
    "تم و رنگ فروشگاه رو از تنظیمات تم شخصی‌سازی کن.",
  ];

  return (
    <AppShell user={session.user} sections={buildDashboardSections(navItems)}>
      <PageHeader
        title={`سلام ${firstName}`}
        description="خلاصه وضعیت فروشگاه‌هات اینجاست"
        action={<CreateStoreSheet />}
      />

      <div className="mt-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pendingOrders > 0 && (
          <Card variant="flat">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                <span className="font-medium">{pendingOrders.toLocaleString("fa-IR")} سفارش</span>{" "}
                در انتظار پرداخت است.
              </p>
              {stores.length === 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/stores/${stores[0].id}/orders`}>مشاهده سفارش‌ها</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">فروشگاه‌های شما</h2>
              {stores.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/stores">
                    همه
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {stores.length === 0 ? (
              <Card variant="flat">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                    <Store className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">هنوز فروشگاهی ندارید</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    اولین فروشگاه آنلاین خود را بسازید و شروع به فروش کنید.
                  </p>
                  <div className="mt-6">
                    <CreateStoreSheet />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {stores.slice(0, 4).map((store) => (
                  <Card key={store.id} variant="interactive">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{store.name}</p>
                        <p className="text-caption" dir="ltr">
                          /s/{store.slug}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {store._count.products.toLocaleString("fa-IR")} محصول ·{" "}
                          {store._count.orders.toLocaleString("fa-IR")} سفارش
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={store.status === "ACTIVE" ? "success" : "secondary"}>
                          {store.status === "ACTIVE" ? "فعال" : "غیرفعال"}
                        </Badge>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/stores/${store.id}`}>مدیریت</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {recentOrders.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="font-semibold">آخرین سفارش‌ها</h2>
                    {stores.length === 1 && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/stores/${stores[0].id}/orders`}>
                          همه
                          <ArrowLeft className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <ul className="divide-y divide-border">
                    {recentOrders.map((order) => {
                      const status = orderStatusStyle[order.status] ?? {
                        dot: "bg-neutral-400",
                        label: order.status,
                      };
                      return (
                        <li key={order.id}>
                          <Link
                            href={`/dashboard/stores/${order.store.id}/orders`}
                            className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/50"
                          >
                            <div className="min-w-0">
                              <p className="font-medium truncate">{order.customerName}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                {order.store.name} · {formatOrderDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="shrink-0 text-left">
                              <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                              <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                                <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                                {status.label}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">راهنمای شروع</h2>
            <Card>
              <CardContent className="space-y-3 p-5">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {i + 1}
                    </span>
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">ارتباط با ما</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      سوال یا پیشنهادی داری؟ تیم پشتیبانی کنارت هست.
                    </p>
                    <Button variant="link" className="mt-2 h-auto p-0" asChild>
                      <Link href="/dashboard/contact">
                        <Mail className="h-3.5 w-3.5" />
                        تماس با پشتیبانی
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
