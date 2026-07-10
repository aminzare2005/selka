import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type StoreHeaderProps = {
  storeName: string;
  storeSlug: string;
  logo?: string;
};

export function StoreHeader({ storeName, storeSlug, logo }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-muted)]/10 bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href={`/s/${storeSlug}`}
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={storeName} className="h-8" />
          ) : (
            storeName
          )}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href={`/s/${storeSlug}`}
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            خانه
          </Link>
          <Link
            href={`/s/${storeSlug}#products`}
            className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            محصولات
          </Link>
          <Link
            href={`/s/${storeSlug}/cart`}
            className="flex items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ShoppingBag className="h-4 w-4" />
            سبد
          </Link>
        </nav>
      </div>
    </header>
  );
}
