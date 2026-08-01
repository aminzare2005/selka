import Link from "next/link";
import type { CheckoutResultPageProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function DefaultCheckoutResultPage({ store, status, orderId }: CheckoutResultPageProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-8">
      <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {isSuccess ? "موفق" : "ناموفق"}
      </p>
      <h1
        className="mt-4 text-[28px] font-normal tracking-tight"
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

      <div className="mt-10 flex flex-col items-center gap-4">
        {isSuccess ? (
          <Link
            href={storePath(store.slug, "/dashboard/orders")}
            className="inline-flex h-11 items-center bg-[var(--color-foreground)] px-8 text-[13px] text-[var(--color-background)] hover:opacity-85"
          >
            سفارش‌های من
          </Link>
        ) : null}
        <Link
          href={storePath(store.slug)}
          className="text-[13px] underline underline-offset-4 hover:opacity-70"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
