"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { toast } from "sonner";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
};

export function ProductDetail({ product, storeSlug }: { product: Product; storeSlug: string }) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const addToCart = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("به سبد خرید اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["cart", storeSlug] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-[var(--color-accent)]">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">بدون تصویر</div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1
            className="text-h1 text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h1>
          <PriceDisplay
            amount={product.price}
            compareAt={product.compareAtPrice}
            size="lg"
            className="mt-4"
          />
          {product.description && (
            <p className="mt-6 text-[var(--color-muted)] leading-relaxed">{product.description}</p>
          )}
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {product.stock > 0 ? `موجودی: ${product.stock}` : "ناموجود"}
          </p>

          {product.stock > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
              <Button
                className="flex-1 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-full sm:flex-none sm:px-8"
                size="lg"
                onClick={() => addToCart.mutate()}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? "..." : "افزودن به سبد"}
              </Button>
            </div>
          )}

          <Button variant="outline" className="mt-4 rounded-full" asChild>
            <Link href={`/s/${storeSlug}/cart`}>مشاهده سبد خرید</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
