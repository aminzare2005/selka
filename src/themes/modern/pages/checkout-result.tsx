import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import type { CheckoutResultPageProps } from "@marty/theme-sdk";
import { Button } from "@/components/ui/button";
import { storePath } from "@/lib/storefront-url";

export function ModernCheckoutResultPage({ store, status, orderId }: CheckoutResultPageProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      {isSuccess ? (
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
      ) : (
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
      )}
      <h1 className="mt-6 text-h2" style={{ fontFamily: "var(--font-display)" }}>
        {isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
      </h1>
      <p className="mt-3 text-[var(--color-muted)]">
        {isSuccess ? "سفارش شما با موفقیت ثبت شد." : "متأسفانه پرداخت انجام نشد."}
      </p>
      {orderId && <p className="mt-3 text-sm text-[var(--color-muted)]" dir="ltr">شماره سفارش: {orderId}</p>}
      <Button className="mt-8 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90" size="lg" asChild>
        <Link href={storePath(store.slug)}>بازگشت به فروشگاه</Link>
      </Button>
    </div>
  );
}
