import Link from "next/link";
import { AlertCircle, CheckCircle2, Package, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { getStoreCustomer } from "@/lib/store-customer";
import { storePath } from "@/lib/storefront-url";
import { BuyerOrderRow } from "@/components/storefront/buyer-order-row";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export default async function BuyerDashboardHome({ params }: Params) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) return null;

  const store = await db.store.findUnique({ where: { slug } });
  if (!store) return null;

  const where = { storeId: store.id, customerId: session.user.id };

  const [customer, orders, orderCount, paidCount, pendingCount] = await Promise.all([
    getStoreCustomer(store.id, session.user.id),
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    db.order.count({ where }),
    db.order.count({ where: { ...where, status: "PAID" } }),
    db.order.count({ where: { ...where, status: "PENDING" } }),
  ]);

  const profileFields = [
    { ok: Boolean(customer?.name?.trim()), label: "نام" },
    { ok: Boolean(customer?.phone?.trim()), label: "تلفن" },
    { ok: Boolean(customer?.address?.trim()), label: "آدرس" },
  ];
  const profileComplete = profileFields.every((f) => f.ok);
  const profileDone = profileFields.filter((f) => f.ok).length;
  const firstName = session.user.name?.trim().split(/\s+/)[0];

  return (
    <div className="space-y-8">
      <header>
        <h1
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          سلام{firstName ? ` ${firstName}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[var(--color-muted)]">
          از اینجا سفارش‌های «{store.name}» را پیگیری کن و اطلاعات تحویلت را کامل نگه دار.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href={storePath(slug, "/dashboard/orders")}
          className="rounded-2xl border border-[var(--color-muted)]/15 p-4 transition-colors hover:border-[var(--color-foreground)]/25 hover:bg-[var(--color-accent)]/50"
        >
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Package className="h-4 w-4" />
            <span className="text-[12px]">کل سفارش‌ها</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {orderCount.toLocaleString("fa-IR")}
          </p>
          <p className="mt-1 text-[12px] text-[var(--color-muted)]">
            {pendingCount > 0
              ? `${pendingCount.toLocaleString("fa-IR")} در انتظار پرداخت`
              : "مشاهده تاریخچه"}
          </p>
        </Link>

        <div className="rounded-2xl border border-[var(--color-muted)]/15 p-4">
          <p className="text-[12px] text-[var(--color-muted)]">پرداخت‌شده</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {paidCount.toLocaleString("fa-IR")}
          </p>
          <p className="mt-1 text-[12px] text-[var(--color-muted)]">سفارش موفق</p>
        </div>

        <Link
          href={storePath(slug, "/dashboard/profile")}
          className={cn(
            "rounded-2xl border p-4 transition-colors",
            profileComplete
              ? "border-[var(--color-muted)]/15 hover:bg-[var(--color-accent)]/50"
              : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50",
          )}
        >
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <UserRound className="h-4 w-4" />
            <span className="text-[12px]">پروفایل تحویل</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {profileDone.toLocaleString("fa-IR")}
            <span className="text-base font-normal text-[var(--color-muted)]"> / ۳</span>
          </p>
          <p className="mt-1 text-[12px] text-[var(--color-muted)]">
            {profileComplete ? "کامل است" : "نیاز به تکمیل دارد"}
          </p>
        </Link>
      </section>

      {!profileComplete ? (
        <section className="flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 px-4 py-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">اطلاعات تحویل ناقص است</p>
            <p className="mt-1 text-[13px] text-[var(--color-muted)]">
              برای خرید بعدی این موارد را کامل کن:{" "}
              {profileFields
                .filter((f) => !f.ok)
                .map((f) => f.label)
                .join("، ")}
            </p>
            <Link
              href={storePath(slug, "/dashboard/profile")}
              className="mt-3 inline-flex text-[13px] font-medium underline-offset-4 hover:underline"
            >
              تکمیل پروفایل
            </Link>
          </div>
        </section>
      ) : (
        <section className="flex items-center gap-3 rounded-2xl border border-[var(--color-muted)]/15 px-4 py-3 text-[13px] text-[var(--color-muted)]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          اطلاعات تحویل این فروشگاه کامل است
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-display)" }}>
            سفارش‌های اخیر
          </h2>
          <Link
            href={storePath(slug, "/dashboard/orders")}
            className="text-[12px] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            همه سفارش‌ها
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-muted)]/25 px-5 py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-[var(--color-muted)]" />
            <p className="mt-3 text-[14px] text-[var(--color-muted)]">هنوز سفارشی ثبت نکردی</p>
            <Link
              href={storePath(slug, "/products")}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 text-[13px] text-[var(--color-background)]"
            >
              رفتن به محصولات
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
      </section>
    </div>
  );
}
