import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { DashboardStatsOverview } from "@/components/dashboard/dashboard-stats-overview";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { CreateStoreSheet } from "@/components/dashboard/create-store-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toneSurface } from "@/components/ui/tone";
import { storePath } from "@/lib/storefront-url";

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tehran",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
  if (hour < 5) return "شب‌بخیر";
  if (hour < 12) return "صبح‌بخیر";
  if (hour < 17) return "ظهرت بخیر";
  if (hour < 21) return "عصرت بخیر";
  return "شب‌بخیر";
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = session.user.name?.trim().split(/\s+/)[0] ?? "";
  const store = await getPrimaryStoreForUser(session.user.id);

  if (!store) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-h2">
            {greeting()}
            {firstName ? `، ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            یک قدم تا فروشگاه خودت فاصله داری.
          </p>
        </div>
        <EmptyState
          icon={<Store />}
          title="بیا اولین فروشگاهت رو بسازیم"
          description="فقط یک اسم لازم داری. بقیه‌اش با ما — محصول، پرداخت و ظاهر فروشگاه رو هر وقت خواستی عوض کن."
          action={<CreateStoreSheet />}
        />
      </div>
    );
  }

  const storeId = store.id;

  const [productCount, orderCount, pendingOrders, paidOrders, revenue] = await Promise.all([
    db.product.count({ where: { storeId } }),
    db.order.count({ where: { storeId } }),
    db.order.count({ where: { storeId, status: "PENDING" } }),
    db.order.count({ where: { storeId, status: "PAID" } }),
    db.order.aggregate({
      where: { storeId, status: "PAID" },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = revenue._sum.totalAmount ?? 0;

  const quickLinks = [
    {
      href: "/dashboard/products",
      label: "محصولات",
      description: "محصول اضافه کن یا موجودی‌ها را به‌روز کن",
      icon: Package,
      tone: "brand",
      count: productCount,
      countLabel: "محصول",
    },
    {
      href: "/dashboard/orders",
      label: "سفارش‌ها",
      description: "ببین مشتری‌ها چی سفارش داده‌اند",
      icon: ShoppingBag,
      tone: "mint",
      count: orderCount,
      countLabel: "سفارش",
    },
    {
      href: "/dashboard/theme",
      label: "تم",
      description: "ظاهر و چیدمان فروشگاه را عوض کن",
      icon: Palette,
      tone: "ocean",
    },
    {
      href: "/dashboard/settings",
      label: "تنظیمات",
      description: "اسم، رنگ، لوگو و صفحه اصلی",
      icon: Settings,
      tone: "sun",
    },
    {
      href: "/dashboard/gateways",
      label: "درگاه‌های پرداخت",
      description: "زیبال و بقیه درگاه‌ها را وصل کن",
      icon: CreditCard,
      tone: "brand",
    },
  ] as const;

  const isFresh = productCount === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2">
            {greeting()}
            {firstName ? `، ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isFresh
              ? `«${store.name}» آماده‌ست، فقط محصول‌هات مانده.`
              : `${store.name} چطور پیش میره؟`}
          </p>
        </div>
      </div>

      <DashboardStatsOverview
        productCount={productCount}
        paidOrders={paidOrders}
        pendingOrders={pendingOrders}
        totalRevenue={totalRevenue}
      />

      {pendingOrders > 0 && (
        <Card className="animate-pop-in border-sun-100 bg-sun-100/50 shadow-none">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-sun-600">
                <Clock className="h-5 w-5" />
              </span>
              <p className="text-sm text-sun-800">
                <span className="font-bold">
                  {pendingOrders.toLocaleString("fa-IR")} سفارش
                </span>{" "}
                منتظر پرداخته — یک سر بهشان بزن.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href="/dashboard/orders">مشاهده سفارش‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-h3">میان‌بُرها</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          هر بخش از فروشگاه یک کلیک با تو فاصله دارد.
        </p>
        <div className="stagger mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group block">
              <Card variant="interactive" className="h-full">
                <CardContent className="flex items-center gap-3.5 p-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneSurface[link.tone]}`}
                  >
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{link.label}</p>
                      {"count" in link && link.count > 0 && (
                        <Badge variant="secondary">
                          {link.count.toLocaleString("fa-IR")} {link.countLabel}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-brand-600" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
