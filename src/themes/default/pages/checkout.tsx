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
  "h-11 rounded-none border-0 border-b border-[#b6b6b6] bg-transparent px-0 shadow-none focus-visible:border-[var(--color-foreground)] focus-visible:ring-0";

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
        <Link href={storePath(store.slug)} className="mt-6 inline-block text-[13px] underline">
          بازگشت
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12 sm:px-8 sm:py-16">
      <h1
        className="text-center text-[22px] font-normal tracking-tight sm:text-[30px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        تکمیل خرید
      </h1>
      <p className="mt-3 text-center text-[13px] text-[var(--color-muted)]">
        اگر وارد حساب شده باشید، اطلاعات پروفایل این فروشگاه اینجا پر می‌شود.
      </p>

      <div className="mt-10 border-y border-[#e6e6e6] py-5 text-center">
        <p className="text-[13px] text-[var(--color-muted)]">مبلغ قابل پرداخت</p>
        <p className="mt-1 text-[22px] font-normal" dir="ltr">
          {formatPrice(cart.total)}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkout.mutate();
        }}
        className="mt-10 space-y-8"
      >
        <div className="space-y-2">
          <Label className="text-[13px] font-normal text-[var(--color-muted)]">
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
          <Label className="text-[13px] font-normal text-[var(--color-muted)]">شماره تماس</Label>
          <PhoneInput value={phone} onChange={setPhone} required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label className="text-[13px] font-normal text-[var(--color-muted)]">آدرس</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="min-h-24 rounded-none border-0 border-b border-[#b6b6b6] bg-transparent px-0 shadow-none focus-visible:border-[var(--color-foreground)] focus-visible:ring-0"
          />
        </div>

        {gateways.length > 0 && (
          <div className="space-y-3">
            <Label className="text-[13px] font-normal text-[var(--color-muted)]">درگاه پرداخت</Label>
            <div className="flex flex-wrap gap-2">
              {gateways.map((g) => {
                const active = gatewaySlug === g.slug;
                return (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => setGatewaySlug(g.slug)}
                    className={`h-10 px-4 text-[13px] font-normal transition-colors ${
                      active
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "border border-[#e6e6e6] text-[var(--color-foreground)] hover:bg-[var(--color-accent)]"
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
          className="flex h-11 w-full items-center justify-center bg-[var(--color-foreground)] text-[13px] font-normal text-[var(--color-background)] hover:opacity-85 disabled:opacity-50"
          disabled={checkout.isPending || gateways.length === 0}
        >
          {checkout.isPending ? "در حال انتقال..." : "پرداخت"}
        </button>

        <p className="text-center text-[12px] text-[var(--color-muted)]">
          حساب ندارید؟{" "}
          <Link href={storePath(store.slug, "/register")} className="underline">
            ثبت‌نام
          </Link>
        </p>
      </form>
    </div>
  );
}
