import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

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

  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-muted)]/25 p-10 text-center text-[var(--color-muted)]">
        سفارشی ثبت نشده.{" "}
        <Link href={storePath(slug)} className="underline">
          شروع خرید
        </Link>
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={storePath(slug, `/dashboard/orders/${order.id}`)}
            className="block rounded-2xl border border-[var(--color-muted)]/15 p-5 hover:bg-[var(--color-accent)]/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold">{ORDER_STATUS_LABEL[order.status] ?? order.status}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {order.items.length.toLocaleString("fa-IR")} قلم
                </p>
              </div>
              <p className="font-semibold text-[var(--color-primary)]">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
