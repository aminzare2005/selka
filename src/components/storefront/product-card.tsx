import Link from "next/link";
import { PriceDisplay } from "./price-display";
import { productPath } from "@/lib/storefront-url";

type ProductCardProps = {
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string;
  storeSlug: string;
  layout?: "grid" | "list";
};

export function ProductCard({
  title,
  slug,
  price,
  compareAtPrice,
  image,
  storeSlug,
  layout = "grid",
}: ProductCardProps) {
  if (layout === "list") {
    return (
      <Link
        href={productPath(storeSlug, slug)}
        className="group flex gap-5 rounded-2xl p-4 transition-all duration-200 hover:bg-[var(--color-accent)]"
      >
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-accent)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">بدون تصویر</div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
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
      className="group block"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-[var(--color-accent)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            بدون تصویر
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
          {title}
        </h3>
        <PriceDisplay amount={price} compareAt={compareAtPrice} size="sm" className="mt-1" />
      </div>
    </Link>
  );
}
