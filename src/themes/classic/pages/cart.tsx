"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartPageProps } from "@marty/theme-sdk";
import { useCart } from "@/hooks/storefront/use-cart";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { productPath, storePath } from "@/lib/storefront-url";

export function ClassicCartPage({ store }: CartPageProps) {
  const { data, isLoading, updateItem } = useCart(store.slug);
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1
        className="border-b-2 border-[var(--color-primary)] pb-3 text-center text-2xl font-bold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        فاکتور سبد خرید
      </h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
          <Link
            href={storePath(store.slug)}
            className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-6 py-2 text-white"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="divide-y-2 divide-dashed divide-[var(--color-primary)]/20 rounded-lg border-2 border-[var(--color-primary)]/20 bg-[var(--color-accent)]/30">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                {item.product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.product.images[0]} alt={item.product.title} className="h-16 w-16 rounded border border-[var(--color-primary)]/20 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <Link href={productPath(store.slug, item.product.slug)} className="font-semibold hover:text-[var(--color-primary)]">
                    {item.product.title}
                  </Link>
                  <PriceDisplay amount={item.product.price} size="sm" className="mt-1" />
                </div>
                <QuantityStepper value={item.quantity} onChange={(q) => updateItem.mutate({ itemId: item.id, quantity: q })} />
                <button onClick={() => updateItem.mutate({ itemId: item.id, quantity: 0 })} className="text-[var(--color-muted)] hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border-4 border-[var(--color-primary)] bg-[var(--color-background)] p-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">جمع کل قابل پرداخت</p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              {formatPrice(data?.total ?? 0)}
            </p>
            <Link
              href={storePath(store.slug, "/checkout")}
              className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-10 py-3 font-semibold text-white hover:opacity-90"
            >
              ادامه و پرداخت
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
