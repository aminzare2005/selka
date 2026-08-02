import Link from "next/link";
import type { CheckoutResultPageProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function DefaultCheckoutResultPage({ store, status, orderId }: CheckoutResultPageProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8 sm:py-24">
      <div className="rounded-[28px] bg-[var(--color-accent)] px-6 py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {isSuccess ? "موفق" : "ناموفق"}
        </p>
        <h1
          className="mt-4 text-[28px] font-bold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
        </h1>
        <p className="mt-4 text-[15px] font-normal leading-relaxed text-[var(--color-muted)]">
          {isSuccess
            ? "سفارش ثبت شد. از حساب کاربری می‌توانید پیگیری کنید."
            : "پرداخت انجام نشد. می‌توانید دوباره تلاش کنید."}
        </p>
        {orderId ? (
          <p className="mt-4 text-[13px] text-[var(--color-muted)]" dir="ltr">
            {orderId}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col items-center gap-3">
          {isSuccess ? (
            <Link
              href={storePath(store.slug, "/dashboard/orders")}
              className="inline-flex h-12 items-center rounded-full bg-[var(--color-foreground)] px-8 text-[13px] font-bold text-[var(--color-background)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              سفارش‌های من
            </Link>
          ) : null}
          <Link
            href={storePath(store.slug)}
            className="inline-flex h-11 items-center rounded-full px-5 text-[13px] font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
