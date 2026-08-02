import Link from "next/link";
import { Package } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { storePath } from "@/lib/storefront-url";
import { BuyerOrderRow } from "@/components/storefront/buyer-order-row";

type Params = { params: Promise<{ slug: string }> };

export default async function BuyerOrdersPage({ params }: Params) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) return null;

  const store = await db.store.findUnique({ where: { slug } });
  if (!store) return null;

  const orders = await db.order.findMany({
    where: { storeId: store.id, customerId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          سفارش‌ها
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-muted)]">
          همه خریدهایت از این فروشگاه در یک جا
          {orders.length > 0
            ? ` — ${orders.length.toLocaleString("fa-IR")} مورد`
            : ""}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-muted)]/25 px-5 py-14 text-center">
          <Package className="mx-auto h-8 w-8 text-[var(--color-muted)]" />
          <p className="mt-3 text-[14px] text-[var(--color-muted)]">هنوز سفارشی نداری</p>
          <Link
            href={storePath(slug, "/products")}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 text-[13px] text-[var(--color-background)]"
          >
            شروع خرید
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-muted)]/15 overflow-hidden rounded-2xl border border-[var(--color-muted)]/15">
          {orders.map((order) => (
            <li key={order.id} className="px-4">
              <BuyerOrderRow
                storeSlug={slug}
                order={{
                  id: order.id,
                  status: order.status,
                  totalAmount: order.totalAmount,
                  createdAt: order.createdAt,
                  itemCount: order.items.length,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
