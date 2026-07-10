import type { CheckoutResultPageProps } from "@tix/theme-sdk";

export function ShalomCheckoutResultPage({ store, status, orderId }: CheckoutResultPageProps) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <p className="text-7xl">{isSuccess ? "🎉" : "😢"}</p>
      <h1
        className="mt-6 text-4xl font-black text-[#18181b]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {isSuccess ? "یووو! پرداخت شد" : "اوپس! نشد"}
      </h1>
      <p className="mt-4 text-lg text-[#71717a]">
        {isSuccess ? "سفارشت ثبت شد، دمت گرم!" : "دوباره امتحان کن، حتماً درمیاد"}
      </p>
      {orderId && (
        <p className="mt-4 rounded-2xl bg-[#fdf4ff] px-4 py-2 text-sm font-bold text-[#a855f7]" dir="ltr">
          #{orderId}
        </p>
      )}
      <a
        href={`/s/${store.slug}`}
        className="mt-8 inline-block rounded-full bg-[#18181b] px-10 py-4 font-bold text-white hover:scale-105 transition-transform"
      >
        برگرد فروشگاه 🏠
      </a>
    </div>
  );
}
