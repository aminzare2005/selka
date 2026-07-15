import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storePath } from "@/lib/storefront-url";

export function CheckoutResult({
  storeSlug,
  status,
  orderId,
}: {
  storeSlug: string;
  status?: string;
  orderId?: string;
}) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center animate-slide-up">
      {isSuccess ? (
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
      ) : (
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
      )}

      <h1 className="mt-6 text-h2" style={{ fontFamily: "var(--font-display)" }}>
        {isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
      </h1>
      <p className="mt-3 text-[var(--color-muted)]">
        {isSuccess
          ? "سفارش شما با موفقیت ثبت شد."
          : "متأسفانه پرداخت انجام نشد. لطفاً دوباره تلاش کنید."}
      </p>
      {orderId && (
        <p className="mt-3 text-caption" dir="ltr">شماره سفارش: {orderId}</p>
      )}
      <Button
        className="mt-8 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-full"
        size="lg"
        asChild
      >
        <Link href={storePath(storeSlug)}>بازگشت به فروشگاه</Link>
      </Button>
    </div>
  );
}
