import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function ModernHeader({ store, theme }: SectionProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-muted)]/10 bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href={storePath(store.slug)}
          className="text-lg font-bold tracking-tight text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {theme.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={theme.logo} alt={store.name} className="h-8" />
          ) : (
            store.name
          )}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href={storePath(store.slug)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
            خانه
          </Link>
          <Link href={storePath(store.slug, "/products")} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
            محصولات
          </Link>
          <Link href={storePath(store.slug, "/about-us")} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
            درباره ما
          </Link>
          <Link
            href={storePath(store.slug, "/cart")}
            className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            <ShoppingBag className="h-4 w-4" />
            سبد
          </Link>
        </nav>
      </div>
    </header>
  );
}
