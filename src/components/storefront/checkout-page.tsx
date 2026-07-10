"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

type Gateway = { slug: string; name: string };
type CartData = { items: unknown[]; total: number };

export function CheckoutPage({ storeSlug }: { storeSlug: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gatewaySlug, setGatewaySlug] = useState("");

  const { data: cart } = useQuery<CartData>({
    queryKey: ["cart", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/cart`);
      return res.json();
    },
  });

  const { data: gateways = [] } = useQuery<Gateway[]>({
    queryKey: ["store-gateways", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/gateways`);
      return res.json();
    },
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          gatewaySlug: gatewaySlug || gateways[0]?.slug,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: (data) => {
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
        <Button className="mt-6 rounded-full" asChild>
          <Link href={`/s/${storeSlug}`}>بازگشت</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10 animate-fade-in">
      <h1 className="text-h2" style={{ fontFamily: "var(--font-display)" }}>تکمیل خرید</h1>

      {/* Step indicators */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">۱. اطلاعات</span>
        <span className="text-[var(--color-muted)]">—</span>
        <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">۲. پرداخت</span>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-muted)]/10 p-5">
        <p className="text-sm text-[var(--color-muted)]">مبلغ قابل پرداخت</p>
        <p className="mt-1 text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {formatPrice(cart.total)}
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); checkout.mutate(); }}
        className="mt-8 space-y-5"
      >
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
                  variant={gatewaySlug === g.slug || (!gatewaySlug && g === gateways[0]) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setGatewaySlug(g.slug)}
                >
                  {g.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {gateways.length === 0 && (
          <p className="text-sm text-red-600">درگاه پرداخت فعالی وجود ندارد</p>
        )}

        <Button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white hover:opacity-90 rounded-full"
          size="lg"
          disabled={checkout.isPending || gateways.length === 0}
        >
          {checkout.isPending ? "در حال انتقال..." : "پرداخت"}
        </Button>
      </form>
    </div>
  );
}
