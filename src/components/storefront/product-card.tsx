import Link from "next/link";
import { PriceDisplay } from "./price-display";
import { productPath } from "@/lib/storefront-url";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string;
  storeSlug: string;
  layout?: "grid" | "list";
  stock?: number;
  className?: string;
  imageClassName?: string;
};

export function ProductCard({
  title,
  slug,
  price,
  compareAtPrice,
  image,
  storeSlug,
  layout = "grid",
  stock,
  className,
  imageClassName,
}: ProductCardProps) {
  const soldOut = typeof stock === "number" && stock <= 0;

  if (layout === "list") {
    return (
      <Link
        href={productPath(storeSlug, slug)}
        className={cn(
          "group flex cursor-pointer gap-4 p-3 transition-colors duration-200 hover:bg-[var(--color-accent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
          className,
        )}
      >
        <div
          className={cn(
            "relative h-24 w-24 shrink-0 overflow-hidden bg-[var(--color-accent)]",
            "rounded-[var(--radius,0.75rem)]",
            imageClassName,
          )}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
              بدون تصویر
            </div>
          )}
          {soldOut ? (
            <span className="absolute inset-x-0 bottom-0 bg-[var(--color-foreground)]/80 py-0.5 text-center text-[10px] text-[var(--color-background)]">
              ناموجود
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-medium text-[var(--color-foreground)] transition-opacity group-hover:opacity-80">
            {title}
          </h3>
          <PriceDisplay amount={price} compareAt={compareAtPrice} size="sm" className="mt-1" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={productPath(storeSlug, slug)}
      className={cn(
        "group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden bg-[var(--color-accent)]",
          "rounded-[var(--radius,0.75rem)]",
          imageClassName,
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            بدون تصویر
          </div>
        )}
        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-[var(--color-foreground)]/80 py-1.5 text-center text-xs text-[var(--color-background)]">
            ناموجود
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-snug text-[var(--color-foreground)] transition-opacity group-hover:opacity-80">
          {title}
        </h3>
        <PriceDisplay amount={price} compareAt={compareAtPrice} size="sm" />
      </div>
    </Link>
  );
}
