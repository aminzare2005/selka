import Link from "next/link";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function DefaultHero({ store, settings }: SectionProps) {
  const heroTitle = (settings.heroTitle as string) || store.name;
  const heroSubtitle =
    (settings.heroSubtitle as string) || "منتخب‌ها، با سادگی و دقت";
  const heroImage = settings.heroImage as string | undefined;

  if (heroImage) {
    return (
      <section className="relative">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-accent)] sm:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt={heroTitle} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1
              className="max-w-3xl text-[28px] font-normal leading-[1.2] tracking-tight sm:text-[40px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-[15px] font-normal text-white/85">{heroSubtitle}</p>
            <Link
              href={`${storePath(store.slug)}#products`}
              className="mt-8 text-[13px] font-normal uppercase tracking-[0.14em] underline underline-offset-8"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[#e6e6e6]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-[var(--color-muted)]">
          فروشگاه
        </p>
        <h1
          className="mt-5 max-w-2xl text-[30px] font-normal leading-[1.2] tracking-tight text-[var(--color-foreground)] sm:text-[42px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heroTitle}
        </h1>
        <p className="mt-5 max-w-md text-[15px] font-normal leading-relaxed text-[var(--color-muted)]">
          {heroSubtitle}
        </p>
        <Link
          href={`${storePath(store.slug)}#products`}
          className="mt-10 inline-flex h-11 items-center justify-center bg-[var(--color-foreground)] px-8 text-[13px] font-normal text-[var(--color-background)] transition-opacity hover:opacity-85"
        >
          مشاهده محصولات
        </Link>
      </div>
    </section>
  );
}
