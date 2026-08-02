import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

const solidBtn =
  "inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-foreground)] px-8 text-[13px] font-bold text-[var(--color-background)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]";

const ghostBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-[13px] font-semibold text-[var(--color-foreground)] transition-[background-color,transform] duration-150 hover:bg-[#ececec] active:scale-[0.97]";

const textLink =
  "group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-foreground)] transition-opacity duration-200 hover:opacity-60";

export function DefaultHero({ store, products, settings }: SectionProps) {
  const heroTitle = (settings.heroTitle as string)?.trim() || store.name;
  const heroSubtitle =
    (settings.heroSubtitle as string)?.trim() ||
    "منتخب‌ها را ببین، انتخاب کن، و با چند کلیک سفارش بده.";
  const heroImage = settings.heroImage as string | undefined;
  const productCount = products.length;

  if (heroImage) {
    return (
      <section className="sm:px-8 sm:pt-6">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden bg-[var(--color-accent)] sm:rounded-[28px]">
          {/* Mobile: tall full-bleed. Desktop: cinematic inset card. */}
          <div className="relative min-h-[72dvh] w-full sm:min-h-0 sm:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={heroTitle}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

            <div className="absolute inset-0 flex flex-col justify-end px-5 pb-10 pt-24 text-white sm:items-center sm:justify-center sm:px-8 sm:pb-0 sm:pt-0 sm:text-center">
              <h1
                className="max-w-xl text-[34px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:max-w-3xl sm:text-[48px] sm:leading-[1.1]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {heroTitle}
              </h1>
              {heroSubtitle ? (
                <p className="mt-3 max-w-md text-[15px] font-normal leading-relaxed text-white/85 sm:mt-4 sm:text-center">
                  {heroSubtitle}
                </p>
              ) : null}

              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
                <Link
                  href={storePath(store.slug, "/products")}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-[13px] font-bold text-[var(--color-foreground)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97] sm:h-11 sm:w-auto sm:px-7"
                >
                  مشاهده محصولات
                </Link>
                <Link
                  href={storePath(store.slug, "/about-us")}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold text-white/90 transition-[background-color,transform] duration-150 hover:bg-white/15 hover:text-white active:scale-[0.97] sm:w-auto sm:px-5"
                >
                  درباره فروشگاه
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pt-6 sm:px-8 sm:pt-10">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-10">
        <div className="flex flex-col justify-center rounded-[28px] bg-[var(--color-accent)]/60 px-7 py-12 sm:px-10 sm:py-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {store.name}
          </p>
          <h1
            className="mt-4 max-w-2xl text-[36px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--color-foreground)] sm:text-[52px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-lg text-[16px] font-normal leading-[1.8] text-[var(--color-muted)]">
            {heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href={storePath(store.slug, "/products")} className={solidBtn}>
              مشاهده محصولات
            </Link>
            <Link href={storePath(store.slug, "/about-us")} className={ghostBtn}>
              درباره ما
            </Link>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] bg-[var(--color-accent)] px-7 py-10 sm:px-9 sm:py-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              الان در فروشگاه
            </p>
            <p
              className="mt-5 text-[56px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-[var(--color-foreground)] sm:text-[64px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {productCount.toLocaleString("fa-IR")}
            </p>
            <p className="mt-3 text-[15px] font-semibold text-[var(--color-foreground)]">محصول فعال</p>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[var(--color-muted)]">
              {productCount === 0
                ? "به‌زودی محصولات جدید اضافه می‌شود."
                : "از گالری پایین انتخاب کن یا همه را یک‌جا ببین."}
            </p>
          </div>
          {productCount > 0 ? (
            <Link href={storePath(store.slug, "/products")} className={`mt-8 ${textLink}`}>
              رفتن به لیست کامل
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
