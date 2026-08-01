import Link from "next/link";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function DefaultFooter({ store }: SectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[var(--color-foreground)] text-[var(--color-background)]">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        <div>
          <p
            className="text-[22px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {store.name}
          </p>
          <p className="mt-3 max-w-xs text-[13px] font-normal leading-[1.5] text-white/70">
            خرید امن و ساده — ساخته‌شده با سلکا
          </p>
        </div>

        <div className="flex flex-col gap-3 text-[13px] font-normal">
          <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-white/45">فروشگاه</p>
          <Link href={storePath(store.slug)} className="hover:underline">
            خانه
          </Link>
          <Link href={`${storePath(store.slug)}#products`} className="hover:underline">
            محصولات
          </Link>
          <Link href={storePath(store.slug, "/cart")} className="hover:underline">
            سبد خرید
          </Link>
        </div>

        <div className="flex flex-col gap-3 text-[13px] font-normal">
          <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-white/45">حساب</p>
          <Link href={storePath(store.slug, "/dashboard")} className="hover:underline">
            حساب من
          </Link>
          <Link href={storePath(store.slug, "/login")} className="hover:underline">
            ورود
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
          <p className="text-[12px] text-white/45">© {year} {store.name}</p>
        </div>
      </div>
    </footer>
  );
}
