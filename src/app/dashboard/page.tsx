import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Package,
  Palette,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { getPrimaryStoreForUser } from "@/lib/store-access";
import { CreateStoreSheet } from "@/components/dashboard/create-store-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const store = await getPrimaryStoreForUser(session.user.id);

  if (!store) {
    return (
      <div className="flex flex-col items-center py-16 text-center animate-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Store className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-lg font-semibold">فروشگاهت رو بساز</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          اولین فروشگاه آنلاین خود را بساز و محصولاتت را بفروش.
        </p>
        <div className="mt-6">
          <CreateStoreSheet />
        </div>
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

  const stats = [
    { label: "محصولات", value: productCount.toLocaleString("fa-IR"), icon: Package },
    { label: "سفارش موفق", value: paidOrders.toLocaleString("fa-IR"), icon: ShoppingBag },
    { label: "در انتظار پرداخت", value: pendingOrders.toLocaleString("fa-IR"), icon: Clock },
    { label: "درآمد", value: formatPrice(totalRevenue), icon: TrendingUp },
  ];

  const quickLinks = [
    {
      href: "/dashboard/products",
      label: "محصولات",
      description: "افزودن، ویرایش و مدیریت موجودی",
      icon: Package,
      count: productCount,
      countLabel: "محصول",
    },
    {
      href: "/dashboard/orders",
      label: "سفارش‌ها",
      description: "پیگیری و مدیریت سفارش‌های مشتریان",
      icon: ShoppingBag,
      count: orderCount,
      countLabel: "سفارش",
    },
    {
      href: "/dashboard/theme",
      label: "تنظیمات تم",
      description: "ظاهر، رنگ و تم فروشگاه",
      icon: Palette,
    },
    {
      href: "/dashboard/gateways",
      label: "درگاه‌های پرداخت",
      description: "فعال‌سازی زیبال و سایر درگاه‌ها",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-0.5 truncate text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingOrders > 0 && (
        <Card variant="flat" className="border-amber-200 bg-amber-50">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-amber-900">
              <span className="font-medium">{pendingOrders.toLocaleString("fa-IR")} سفارش</span>{" "}
              در انتظار پرداخت است.
            </p>
            <Button variant="outline" size="sm" asChild className="border-amber-300 bg-white hover:bg-amber-50">
              <Link href="/dashboard/orders">مشاهده سفارش‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold">مدیریت فروشگاه</h2>
        <p className="mt-1 text-sm text-muted-foreground">بخش‌های مختلف فروشگاه را از اینجا مدیریت کنید.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card variant="interactive" className="h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-foreground/5">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{link.label}</p>
                      {link.count !== undefined && link.count > 0 && (
                        <Badge variant="secondary" className="text-[10px]">
                          {link.count.toLocaleString("fa-IR")} {link.countLabel}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
