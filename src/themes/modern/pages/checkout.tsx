"use client";

import Link from "next/link";
import type { CheckoutPageProps } from "@marty/theme-sdk";
import { useCheckout } from "@/hooks/storefront/use-checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";

export function ModernCheckoutPage({ store }: CheckoutPageProps) {
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
        <Button className="mt-6 rounded-full" asChild>
          <Link href={`/s/${store.slug}`}>بازگشت</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-h2" style={{ fontFamily: "var(--font-display)" }}>تکمیل خرید</h1>
      <div className="mt-6 rounded-2xl border border-[var(--color-muted)]/10 p-5">
        <p className="text-sm text-[var(--color-muted)]">مبلغ قابل پرداخت</p>
        <p className="mt-1 text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {formatPrice(cart.total)}
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); checkout.mutate(); }} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>نام و نام خانوادگی</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>شماره تماس</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>آدرس</Label>
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        {gateways.length > 0 && (
          <div className="space-y-2">
            <Label>درگاه پرداخت</Label>
            <div className="flex flex-wrap gap-2">
              {gateways.map((g) => (
                <Button
                  key={g.slug}
                  type="button"
                  variant={gatewaySlug === g.slug ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setGatewaySlug(g.slug)}
                >
                  {g.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        {gateways.length === 0 && <p className="text-sm text-red-600">درگاه پرداخت فعالی وجود ندارد</p>}
        <Button
          type="submit"
          className="w-full rounded-full bg-[var(--color-primary)] text-white hover:opacity-90"
          size="lg"
          disabled={checkout.isPending || gateways.length === 0}
        >
          {checkout.isPending ? "در حال انتقال..." : "پرداخت"}
        </Button>
      </form>
    </div>
  );
}
