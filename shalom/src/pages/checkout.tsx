"use client";

import type { CheckoutPageProps } from "@tix/theme-sdk";
import { useCheckout, formatPrice } from "../hooks/use-checkout";

export function ShalomCheckoutPage({ store }: CheckoutPageProps) {
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
        <p className="text-xl text-[#71717a]">سبد خالیه!</p>
        <a href={`/s/${store.slug}`} className="mt-4 inline-block font-bold text-[#a855f7]">برگرد</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-4xl font-black text-[#18181b]" style={{ fontFamily: "var(--font-display)" }}>
        آخرین قدم! 🎯
      </h1>

      <div className="mt-4 flex gap-2 text-sm font-bold">
        <span className="rounded-full bg-[#18181b] px-4 py-1 text-white">۱. اطلاعات</span>
        <span className="rounded-full bg-[#f4f4f5] px-4 py-1 text-[#71717a]">۲. پرداخت</span>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-[#fdf4ff] to-[#f0fdf4] p-5">
        <p className="text-sm text-[#71717a]">مبلغ</p>
        <p className="text-3xl font-black text-[#a855f7]">{formatPrice(cart.total)}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); checkout.mutate(); }} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-bold text-[#71717a]">اسمت چیه؟</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-2xl border-2 border-[#e4e4e7] px-4 py-3 focus:border-[#a855f7] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#71717a]">شماره</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            dir="ltr"
            className="mt-1 w-full rounded-2xl border-2 border-[#e4e4e7] px-4 py-3 focus:border-[#a855f7] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#71717a]">آدرس</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="mt-1 w-full rounded-2xl border-2 border-[#e4e4e7] px-4 py-3 focus:border-[#a855f7] focus:outline-none"
          />
        </div>
        {gateways.length > 0 && (
          <div>
            <label className="text-sm font-bold text-[#71717a]">درگاه</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {gateways.map((g) => (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => setGatewaySlug(g.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    gatewaySlug === g.slug
                      ? "bg-[#18181b] text-white"
                      : "border-2 border-[#e4e4e7] bg-white"
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
          className="w-full rounded-full bg-[#18181b] py-4 text-lg font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {checkout.isPending ? "صبر کن..." : "پرداخت کن 💳"}
        </button>
      </form>
    </div>
  );
}
