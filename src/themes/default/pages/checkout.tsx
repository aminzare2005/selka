"use client";

import Link from "next/link";
import type { CheckoutPageProps } from "@selka/theme-sdk";
import { useCheckout } from "@/hooks/storefront/use-checkout";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";

const fieldClass =
  "h-12 rounded-2xl border-0 bg-[var(--color-accent)] px-4 shadow-none hover:bg-[#ececec] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/10";

export function DefaultCheckoutPage({ store }: CheckoutPageProps) {
  const {
    cart,
    gateways,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    gatewaySlug,
    setGatewaySlug,
    checkout,
  } = useCheckout(store.slug);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <p className="text-[13px] text-[var(--color-muted)]">سبد خرید خالی است</p>
        <Link
          href={storePath(store.slug)}
          className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold transition-[opacity,transform] duration-150 hover:opacity-80 active:scale-[0.97]"
        >
          بازگشت
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-16">
      <h1
        className="text-center text-[26px] font-bold tracking-[-0.02em] sm:text-[32px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        تکمیل خرید
      </h1>
      <p className="mt-3 text-center text-[13px] leading-relaxed text-[var(--color-muted)]">
        اگر وارد حساب شده باشید، اطلاعات پروفایل این فروشگاه اینجا پر می‌شود.
      </p>

      <div className="mt-10 rounded-[24px] bg-[var(--color-accent)] px-6 py-6 text-center">
        <p className="text-[13px] text-[var(--color-muted)]">مبلغ قابل پرداخت</p>
        <p className="mt-2 text-[28px] font-bold tracking-tight" dir="ltr">
          {formatPrice(cart.total)}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkout.mutate();
        }}
        className="mt-10 space-y-6"
      >
        <div className="space-y-2">
          <Label className="text-[13px] font-medium text-[var(--color-muted)]">
            نام و نام خانوادگی
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[13px] font-medium text-[var(--color-muted)]">شماره تماس</Label>
          <PhoneInput value={phone} onChange={setPhone} required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label className="text-[13px] font-medium text-[var(--color-muted)]">آدرس</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="min-h-28 rounded-2xl border-0 bg-[var(--color-accent)] px-4 py-3 shadow-none hover:bg-[#ececec] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/10"
          />
        </div>

        {gateways.length > 0 && (
          <div className="space-y-3">
            <Label className="text-[13px] font-medium text-[var(--color-muted)]">درگاه پرداخت</Label>
            <div className="flex flex-wrap gap-2">
              {gateways.map((g) => {
                const active = gatewaySlug === g.slug;
                return (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => setGatewaySlug(g.slug)}
                    className={`h-10 rounded-full px-4 text-[13px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.97] ${
                      active
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "bg-[var(--color-accent)] text-[var(--color-foreground)] hover:bg-[#ececec]"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gateways.length === 0 && (
          <p className="text-[13px] text-red-600">درگاه پرداخت فعالی وجود ندارد</p>
        )}

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] text-[13px] font-bold text-[var(--color-background)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97] disabled:opacity-50"
          disabled={checkout.isPending || gateways.length === 0}
        >
          {checkout.isPending ? "در حال انتقال..." : "پرداخت"}
        </button>

        <p className="text-center text-[12px] text-[var(--color-muted)]">
          حساب ندارید؟{" "}
          <Link
            href={storePath(store.slug, "/register")}
            className="font-semibold text-[var(--color-foreground)] transition-opacity hover:opacity-60"
          >
            ثبت‌نام
          </Link>
        </p>
      </form>
    </div>
  );
}
