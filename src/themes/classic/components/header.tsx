import Link from "next/link";
import type { SectionProps } from "@marty/theme-sdk";

export function ClassicHeader({ store, theme }: SectionProps) {
  return (
    <header className="border-b-4 border-[var(--color-primary)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center">
        <Link href={`/s/${store.slug}`} style={{ fontFamily: "var(--font-display)" }}>
          {theme.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={theme.logo} alt={store.name} className="mx-auto h-10" />
          ) : (
            <span className="text-2xl font-bold tracking-wide text-[var(--color-foreground)]">
              {store.name}
            </span>
          )}
        </Link>
        <nav className="mt-4 flex items-center justify-center gap-8 text-sm font-medium">
          <Link href={`/s/${store.slug}`} className="border-b-2 border-transparent hover:border-[var(--color-primary)]">
            خانه
          </Link>
          <Link href={`/s/${store.slug}#products`} className="border-b-2 border-transparent hover:border-[var(--color-primary)]">
            محصولات
          </Link>
          <Link href={`/s/${store.slug}/cart`} className="border-b-2 border-transparent hover:border-[var(--color-primary)]">
            سبد خرید
          </Link>
        </nav>
      </div>
    </header>
  );
}
