import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

type Params = { params: Promise<{ slug: string }> };

export default async function BuyerDashboardHome({ params }: Params) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) return null;

  const store = await db.store.findUnique({ where: { slug } });
  if (!store) return null;

  const orderCount = await db.order.count({
    where: { storeId: store.id, customerId: session.user.id },
  });
  const orders = await db.order.findMany({
    where: { storeId: store.id, customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={storePath(slug, "/dashboard/orders")}
          className="rounded-2xl border border-[var(--color-muted)]/15 bg-[var(--color-accent)]/50 p-5 transition hover:border-[var(--color-primary)]/40"
        >
          <p className="text-sm text-[var(--color-muted)]">سفارش‌ها</p>
          <p className="mt-1 text-2xl font-bold">{orderCount.toLocaleString("fa-IR")}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">مشاهده همه سفارش‌ها</p>
        </Link>
        <Link
          href={storePath(slug, "/dashboard/profile")}
          className="rounded-2xl border border-[var(--color-muted)]/15 bg-[var(--color-accent)]/50 p-5 transition hover:border-[var(--color-primary)]/40"
        >
          <p className="text-sm text-[var(--color-muted)]">پروفایل</p>
          <p className="mt-1 text-lg font-bold">اطلاعات تحویل</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">نام، تلفن و آدرس این فروشگاه</p>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">آخرین سفارش‌ها</h2>
          <Link
            href={storePath(slug, "/dashboard/orders")}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            همه
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-[var(--color-muted)]/25 p-8 text-center text-[var(--color-muted)]">
            هنوز سفارشی نداری.{" "}
            <Link href={storePath(slug)} className="underline">
              برو خرید کن
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={storePath(slug, `/dashboard/orders/${order.id}`)}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-muted)]/15 px-4 py-3 hover:bg-[var(--color-accent)]/40"
                >
                  <div>
                    <p className="font-medium">{ORDER_STATUS_LABEL[order.status] ?? order.status}</p>
                    <p className="text-xs text-[var(--color-muted)]">{formatDate(order.createdAt)}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
