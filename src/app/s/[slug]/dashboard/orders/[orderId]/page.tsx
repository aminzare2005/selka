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
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={storePath(slug, "/dashboard/orders")}
          className="text-[13px] text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline"
        >
          ← بازگشت به سفارش‌ها
        </Link>

        <div className="mt-4 rounded-2xl border border-[var(--color-muted)]/15 p-5 sm:p-6">
          <p className="text-[12px] text-[var(--color-muted)]">{formatDate(order.createdAt)}</p>
          <h1
            className="mt-2 text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {ORDER_STATUS_LABEL[order.status] ?? order.status}
          </h1>
          <p className="mt-3 text-xl tabular-nums" dir="ltr">
            {formatPrice(order.totalAmount)}
          </p>
          <p className="mt-3 text-[11px] tracking-wide text-[var(--color-muted)]" dir="ltr">
            #{order.id.slice(0, 10)}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--color-muted)]/15 p-5 sm:p-6">
        <h2 className="text-[13px] font-medium text-[var(--color-muted)]">اقلام سفارش</h2>
        <ul className="mt-4 divide-y divide-[var(--color-muted)]/15">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 py-3 text-[14px]">
              <div className="min-w-0">
                <p>{item.title}</p>
                <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                  × {item.quantity.toLocaleString("fa-IR")}
                </p>
              </div>
              <p className="shrink-0 tabular-nums" dir="ltr">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--color-muted)]/15 p-5 sm:p-6">
        <h2 className="text-[13px] font-medium text-[var(--color-muted)]">گیرنده و آدرس</h2>
        <div className="mt-4 space-y-2 text-[14px]">
          <p className="font-medium">{order.customerName}</p>
          <p className="text-[var(--color-muted)]" dir="ltr">
            {toUiIranMobile(order.customerPhone)}
          </p>
          <p className="leading-[1.85] text-[var(--color-muted)]">{order.customerAddress}</p>
        </div>
      </section>
    </div>
  );
}
