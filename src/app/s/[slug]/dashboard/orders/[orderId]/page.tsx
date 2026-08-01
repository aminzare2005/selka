import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { toUiIranMobile } from "@/lib/phone";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

type Params = { params: Promise<{ slug: string; orderId: string }> };

export default async function BuyerOrderDetailPage({ params }: Params) {
  const { slug, orderId } = await params;
  const session = await getSession();
  if (!session) return null;

  const store = await db.store.findUnique({ where: { slug } });
  if (!store) notFound();

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      storeId: store.id,
      customerId: session.user.id,
    },
    include: { items: true, payments: { orderBy: { createdAt: "desc" } } },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={storePath(slug, "/dashboard/orders")}
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        ← سفارش‌ها
      </Link>

      <div className="rounded-2xl border border-[var(--color-muted)]/15 p-5">
        <p className="text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</p>
        <p className="mt-1 text-xl font-bold">
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </p>
        <p className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
          {formatPrice(order.totalAmount)}
        </p>
        <p className="mt-3 text-xs text-[var(--color-muted)]" dir="ltr">
          #{order.id.slice(0, 10)}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-muted)]/15 p-5">
        <h2 className="font-bold">اقلام</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.title}{" "}
                <span className="text-[var(--color-muted)]">
                  × {item.quantity.toLocaleString("fa-IR")}
                </span>
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--color-muted)]/15 p-5 text-sm">
        <h2 className="font-bold">تحویل</h2>
        <p className="mt-3">{order.customerName}</p>
        <p className="mt-1 text-[var(--color-muted)]" dir="ltr">
          {toUiIranMobile(order.customerPhone)}
        </p>
        <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{order.customerAddress}</p>
      </div>
    </div>
  );
}
