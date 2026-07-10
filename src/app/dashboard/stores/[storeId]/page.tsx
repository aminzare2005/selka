import Link from "next/link";
import { redirect } from "next/navigation";
import { Palette, Package, CreditCard, ShoppingBag } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreOverviewPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) redirect("/dashboard");

  const [productCount, orderCount, pendingOrders, paidOrders] = await Promise.all([
    db.product.count({ where: { storeId } }),
    db.order.count({ where: { storeId } }),
    db.order.count({ where: { storeId, status: "PENDING" } }),
    db.order.count({ where: { storeId, status: "PAID" } }),
  ]);

  const quickLinks = [
    {
      href: `/dashboard/stores/${storeId}/theme`,
      label: "تنظیمات تم",
      description: "تم، رنگ و ظاهر فروشگاه",
      icon: Palette,
    },
    {
      href: `/dashboard/stores/${storeId}/products`,
      label: "محصولات",
      description: `${productCount.toLocaleString("fa-IR")} محصول`,
      icon: Package,
    },
    {
      href: `/dashboard/stores/${storeId}/gateways`,
      label: "درگاه‌های پرداخت",
      description: "فعال‌سازی زیبال و سایر درگاه‌ها",
      icon: CreditCard,
    },
    {
      href: `/dashboard/stores/${storeId}/orders`,
      label: "سفارش‌ها",
      description: `${orderCount.toLocaleString("fa-IR")} سفارش`,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">محصولات</p>
            <p className="mt-1 text-3xl font-bold">{productCount.toLocaleString("fa-IR")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">سفارش‌های موفق</p>
            <p className="mt-1 text-3xl font-bold">{paidOrders.toLocaleString("fa-IR")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">در انتظار پرداخت</p>
            <p className="mt-1 text-3xl font-bold">{pendingOrders.toLocaleString("fa-IR")}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold">مدیریت فروشگاه</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card variant="interactive" className="h-full">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{link.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
