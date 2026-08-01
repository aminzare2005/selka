import type { SectionProps } from "@selka/theme-sdk";

const items = [
  { title: "پرداخت امن", body: "درگاه معتبر و رمزنگاری‌شده" },
  { title: "پیگیری سفارش", body: "وضعیت را از حساب خود ببینید" },
  { title: "پشتیبانی فروشگاه", body: "ارتباط مستقیم با فروشنده" },
];

export function DefaultTrustStrip(_props: SectionProps) {
  return (
    <section className="bg-[var(--color-accent)]">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-10 sm:grid-cols-3 sm:gap-6 sm:px-8 sm:py-12">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`text-center sm:text-start ${
              i > 0 ? "border-t border-[#e6e6e6] pt-8 sm:border-t-0 sm:border-s sm:pt-0 sm:ps-6" : ""
            }`}
          >
            <p className="text-[13px] font-normal text-[var(--color-foreground)]">{item.title}</p>
            <p className="mt-1 text-[13px] font-normal text-[var(--color-muted)]">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
