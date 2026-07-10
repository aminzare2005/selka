"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductPageProps } from "@tix/theme-sdk";
import { useAddToCart } from "@/hooks/storefront/use-add-to-cart";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";

export function ClassicProductPage({ product, store }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart(store.slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="overflow-hidden rounded-lg border-4 border-[var(--color-primary)]/30 bg-[var(--color-accent)]/50">
        <div className="border-b-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-6 py-3 text-center text-sm font-semibold text-[var(--color-secondary)]">
          جزئیات محصول
        </div>
        <div className="p-6">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title}
              className="mx-auto max-h-80 w-full rounded border-2 border-[var(--color-primary)]/20 object-cover"
            />
          ) : (
            <div className="flex h-48 items-center justify-center border-2 border-dashed border-[var(--color-primary)]/30 text-[var(--color-muted)]">
              بدون تصویر
            </div>
          )}
          <h1
            className="mt-8 text-center text-3xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h1>
          <div className="mt-4 flex justify-center">
            <PriceDisplay amount={product.price} compareAt={product.compareAtPrice} size="lg" />
          </div>
          {product.description && (
            <p className="mt-6 text-center leading-relaxed text-[var(--color-muted)]">{product.description}</p>
          )}
          <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
            {product.stock > 0 ? `✓ موجود (${product.stock} عدد)` : "✗ ناموجود"}
          </p>
          {product.stock > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
              <button
                onClick={() => addToCart.mutate({ productId: product.id, quantity })}
                disabled={addToCart.isPending}
                className="rounded-full bg-[var(--color-primary)] px-8 py-3 font-semibold text-white hover:opacity-90"
              >
                {addToCart.isPending ? "..." : "افزودن به سبد"}
              </button>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link href={`/s/${store.slug}/cart`} className="text-sm text-[var(--color-primary)] underline">
              مشاهده سبد خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
