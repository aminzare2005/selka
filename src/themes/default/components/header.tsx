import Link from "next/link";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";
import { StorefrontHeaderActions } from "@/components/storefront/storefront-header-actions";

export function DefaultHeader({ store, theme }: SectionProps) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)]">
      <div className="border-b border-[#e6e6e6]">
        <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
          {/* Start (RTL right): category / page links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href={storePath(store.slug)}
              className="text-[13px] font-normal text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              خانه
            </Link>
            <Link
              href={`${storePath(store.slug)}#products`}
              className="text-[13px] font-normal text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              محصولات
            </Link>
          </nav>

          {/* Center wordmark */}
          <Link
            href={storePath(store.slug)}
            className="absolute left-1/2 max-w-[50%] -translate-x-1/2 truncate text-center text-[22px] font-bold tracking-tight text-[var(--color-foreground)] md:text-[24px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {theme.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={theme.logo} alt={store.name} className="mx-auto h-7" />
            ) : (
              store.name
            )}
          </Link>

          <div className="ms-auto">
            <StorefrontHeaderActions storeSlug={store.slug} />
          </div>
        </div>
      </div>
    </header>
  );
}
