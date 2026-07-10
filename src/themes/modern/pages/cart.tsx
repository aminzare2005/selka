"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartPageProps } from "@tix/theme-sdk";
import { useCart } from "@/hooks/storefront/use-cart";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export function ModernCartPage({ store }: CartPageProps) {
  const { data, isLoading, updateItem } = useCart(store.slug);
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-6 py-10">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-h2 text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-display)" }}>
        سبد خرید
      </h1>
      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
          <Button className="mt-6 rounded-full" asChild>
            <Link href={`/s/${store.slug}`}>بازگشت به فروشگاه</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-[var(--color-muted)]/10 p-4"
              >
                {item.product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.product.images[0]} alt={item.product.title} className="h-20 w-20 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/s/${store.slug}/products/${item.product.slug}`}
                    className="block truncate font-medium hover:text-[var(--color-primary)]"
                  >
                    {item.product.title}
                  </Link>
                  <PriceDisplay amount={item.product.price} size="sm" className="mt-1" />
                </div>
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => updateItem.mutate({ itemId: item.id, quantity: q })}
                />
                <button
                  onClick={() => updateItem.mutate({ itemId: item.id, quantity: 0 })}
                  className="p-2 text-[var(--color-muted)] hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--color-muted)]/10 p-6">
              <p className="text-sm text-[var(--color-muted)]">جمع کل</p>
              <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(data?.total ?? 0)}
              </p>
              <Button className="mt-6 w-full rounded-full bg-[var(--color-primary)] text-white hover:opacity-90" size="lg" asChild>
                <Link href={`/s/${store.slug}/checkout`}>ادامه خرید</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
