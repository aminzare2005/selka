import type { SectionProps } from "@selka/theme-sdk";

const items = [
  { title: "پرداخت امن", body: "درگاه معتبر و رمزنگاری‌شده" },
  { title: "پیگیری سفارش", body: "وضعیت را از حساب خود ببینید" },
  { title: "پشتیبانی فروشگاه", body: "ارتباط مستقیم با فروشنده" },
];

export function DefaultTrustStrip(_props: SectionProps) {
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-[1280px] gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[22px] bg-[var(--color-accent)] px-6 py-7 sm:px-7 sm:py-8"
          >
            <p
              className="text-[15px] font-bold tracking-tight text-[var(--color-foreground)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
