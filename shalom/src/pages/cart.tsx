"use client";

import type { CartPageProps } from "@marty/theme-sdk";
import { useCart } from "../hooks/use-cart";
import { formatPrice } from "../hooks/use-checkout";

export function ShalomCartPage({ store }: CartPageProps) {
  const { data, isLoading, updateItem } = useCart(store.slug);
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="h-8 w-40 animate-pulse rounded-full bg-[#f4f4f5]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-black text-[#18181b]" style={{ fontFamily: "var(--font-display)" }}>
        سبدت چیه؟ 🛒
      </h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-6xl">😶</p>
          <p className="mt-4 text-xl text-[#71717a]">سبد خالیه، یه چیزی بردار!</p>
          <a
            href={`/s/${store.slug}`}
            className="mt-6 inline-block rounded-full bg-[#18181b] px-8 py-3 font-bold text-white"
          >
            برو فروشگاه
          </a>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-3xl border-2 border-[#e4e4e7] bg-white p-4 transition-transform hover:-rotate-1"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
              >
                {item.product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.product.images[0]} alt={item.product.title} className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#fdf4ff] text-2xl">📦</div>
                )}
                <div className="min-w-0 flex-1">
                  <a href={`/s/${store.slug}/products/${item.product.slug}`} className="font-bold hover:text-[#a855f7]">
                    {item.product.title}
                  </a>
                  <p className="mt-1 font-black text-[#a855f7]">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(0, item.quantity - 1) })}
                    className="rounded-full bg-[#f4f4f5] px-3 py-1 font-bold"
                  >
                    −
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    className="rounded-full bg-[#f4f4f5] px-3 py-1 font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => updateItem.mutate({ itemId: item.id, quantity: 0 })}
                  className="text-[#71717a] hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-gradient-to-br from-[#a855f7] to-[#7c3aed] p-6 text-white">
              <p className="text-sm opacity-90">جمع کل</p>
              <p className="mt-1 text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(data?.total ?? 0)}
              </p>
              <a
                href={`/s/${store.slug}/checkout`}
                className="mt-6 block rounded-full bg-white py-3 text-center font-bold text-[#7c3aed] hover:scale-105 transition-transform"
              >
                بریم پرداخت 💳
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
