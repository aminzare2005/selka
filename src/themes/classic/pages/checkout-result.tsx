import Link from "next/link";
import type { CheckoutResultPageProps } from "@marty/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function ClassicCheckoutResultPage({ store, status, orderId }: CheckoutResultPageProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <div
        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 ${
          isSuccess ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-600"
        }`}
      >
        <span className="text-4xl">{isSuccess ? "✓" : "✗"}</span>
      </div>
      <h1 className="mt-8 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        {isSuccess ? "سفارش ثبت شد!" : "پرداخت ناموفق"}
      </h1>
      <p className="mt-3 text-[var(--color-muted)]">
        {isSuccess ? "از خرید شما سپاسگزاریم. به زودی با شما تماس می‌گیریم." : "لطفاً دوباره تلاش کنید."}
      </p>
      {orderId && (
        <p className="mt-4 rounded border border-dashed border-[var(--color-primary)]/40 px-4 py-2 text-sm" dir="ltr">
          شماره پیگیری: {orderId}
        </p>
      )}
      <Link
        href={storePath(store.slug)}
        className="mt-8 inline-block rounded-full bg-[var(--color-primary)] px-8 py-3 font-semibold text-white"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
