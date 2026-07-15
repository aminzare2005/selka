"use client";

import { useState } from "react";
import type { ProductPageProps } from "@marty/theme-sdk";
import { useAddToCart } from "../hooks/use-add-to-cart";
import { formatPrice } from "../hooks/use-checkout";

export function ShalomProductPage({ product, store }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart(store.slug);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -right-3 -top-3 rounded-full bg-[#a855f7] px-4 py-1 text-sm font-bold text-white rotate-6">
            hot 🔥
          </div>
          <div className="aspect-square overflow-hidden rounded-[2rem] border-4 border-[#e4e4e7] bg-gradient-to-br from-[#fdf4ff] to-[#f0fdf4]">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">📦</div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1
            className="text-4xl font-black text-[#18181b] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h1>
          <p className="mt-4 text-3xl font-black text-[#a855f7]" style={{ fontFamily: "var(--font-display)" }}>
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-6 text-lg text-[#71717a]">{product.description}</p>
          )}
          <p className="mt-4 text-sm font-bold text-[#71717a]">
            {product.stock > 0 ? `✅ ${product.stock} تا مونده` : "❌ تموم شد"}
          </p>
          {product.stock > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border-2 border-[#e4e4e7] px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-xl font-bold"
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="text-xl font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart.mutate({ productId: product.id, quantity })}
                disabled={addToCart.isPending}
                className="rounded-full bg-[#18181b] px-8 py-4 text-lg font-bold text-white hover:scale-105 transition-transform"
              >
                {addToCart.isPending ? "..." : "بریز تو سبد 🛒"}
              </button>
            </div>
          )}
          <a href={`/s/${store.slug}/cart`} className="mt-4 text-sm font-bold text-[#a855f7] hover:underline">
            برو سبد خرید →
          </a>
        </div>
      </div>
    </div>
  );
}
