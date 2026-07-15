"use client";

import Link from "next/link";
import type { CheckoutPageProps } from "@marty/theme-sdk";
import { useCheckout } from "@/hooks/storefront/use-checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";

export function ClassicCheckoutPage({ store }: CheckoutPageProps) {
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
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
        <Link href={storePath(store.slug)} className="mt-6 inline-block text-[var(--color-primary)] underline">
          بازگشت
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <div className="overflow-hidden rounded-lg border-4 border-[var(--color-primary)]/40">
        <div className="bg-[var(--color-primary)] px-6 py-4 text-center text-white">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>فرم سفارش</h1>
          <p className="mt-1 text-sm opacity-90">مبلغ: {formatPrice(cart.total)}</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); checkout.mutate(); }} className="space-y-5 bg-[var(--color-accent)]/40 p-6">
          <div className="space-y-2">
            <Label>نام و نام خانوادگی</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label>شماره تماس</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label>آدرس تحویل</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required className="bg-white" />
          </div>
          {gateways.length > 0 && (
            <div className="space-y-2">
              <Label>روش پرداخت</Label>
              <div className="flex flex-wrap gap-2">
                {gateways.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => setGatewaySlug(g.slug)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium ${
                      gatewaySlug === g.slug
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-primary)]/30 bg-white"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={checkout.isPending || gateways.length === 0}
            className="w-full rounded-full bg-[var(--color-primary)] py-3 font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {checkout.isPending ? "در حال انتقال..." : "تأیید و پرداخت"}
          </button>
        </form>
      </div>
    </div>
  );
}
