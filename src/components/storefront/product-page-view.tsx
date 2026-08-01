"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductPageProps } from "@selka/theme-sdk";
import { useAddToCart } from "@/hooks/storefront/use-add-to-cart";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { StockStatus } from "@/components/storefront/stock-status";
import { StorefrontBreadcrumb } from "@/components/storefront/storefront-breadcrumb";
import { storePath } from "@/lib/storefront-url";
import { cn } from "@/lib/utils";

export type ProductPageViewClassNames = {
  root?: string;
  gallery?: string;
  galleryFrame?: string;
  thumb?: string;
  buyBox?: string;
  title?: string;
  cta?: string;
  stickyBar?: string;
  stepper?: string;
};

type ProductPageViewProps = ProductPageProps & {
  classNames?: ProductPageViewClassNames;
};

/**
 * Shared product UX — mobile gallery + sticky purchase bar,
 * desktop side-by-side buy box. Themes only skin via classNames / CSS vars.
 */
export function ProductPageView({ product, store, classNames }: ProductPageViewProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart(store.slug);
  const inStock = product.stock > 0;

  function handleAdd() {
    if (!inStock) return;
    addToCart.mutate({ productId: product.id, quantity });
  }

  const ctaClass = cn(
    "inline-flex h-12 min-h-12 w-full cursor-pointer items-center justify-center px-6 text-sm font-medium",
    "bg-[var(--color-primary)] text-white transition-opacity duration-200",
    "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
    "disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
    "rounded-[var(--radius,0.75rem)]",
    classNames?.cta,
  );

  const purchaseControls = (
    <>
      {inStock ? (
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
            size="lg"
            className={classNames?.stepper}
          />
          <button
            type="button"
            className={cn(ctaClass, "flex-1")}
            onClick={handleAdd}
            disabled={addToCart.isPending}
          >
            {addToCart.isPending ? "در حال افزودن..." : "افزودن به سبد"}
          </button>
        </div>
      ) : (
        <button type="button" className={ctaClass} disabled>
          فعلاً ناموجود
        </button>
      )}
      <Link
        href={storePath(store.slug, "/cart")}
        className="mt-3 block text-center text-sm text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
      >
        مشاهده سبد خرید
      </Link>
    </>
  );

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl px-4 pb-28 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8",
        classNames?.root,
      )}
    >
      <StorefrontBreadcrumb
        storeSlug={store.slug}
        storeName={store.name}
        current={product.title}
        className="mb-5 sm:mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <ProductGallery
          images={product.images}
          alt={product.title}
          className={classNames?.gallery}
          frameClassName={classNames?.galleryFrame}
          thumbClassName={classNames?.thumb}
        />

        <div
          className={cn(
            "flex flex-col gap-5 lg:sticky lg:top-24",
            classNames?.buyBox,
          )}
        >
          <div className="space-y-3">
            <h1
              className={cn(
                "text-2xl font-medium leading-snug tracking-tight text-[var(--color-foreground)] sm:text-3xl",
                classNames?.title,
              )}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.title}
            </h1>
            <PriceDisplay
              amount={product.price}
              compareAt={product.compareAtPrice}
              size="lg"
            />
            <StockStatus stock={product.stock} />
          </div>

          {product.description ? (
            <div className="border-y border-[var(--color-muted)]/15 py-5">
              <h2 className="text-sm font-medium text-[var(--color-foreground)]">توضیحات</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)]">
                {product.description}
              </p>
            </div>
          ) : null}

          {/* In-flow purchase controls (all breakpoints) */}
          <div>{purchaseControls}</div>
        </div>
      </div>

      {/* Mobile sticky purchase shortcut — mirrors current qty */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-muted)]/15 bg-[var(--color-background)]/95 backdrop-blur-md sm:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
          classNames?.stickyBar,
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4">
          <div className="min-w-0 flex-1">
            <PriceDisplay amount={product.price} size="sm" />
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              {inStock
                ? `تعداد: ${quantity.toLocaleString("fa-IR")}`
                : "ناموجود"}
            </p>
          </div>
          {inStock ? (
            <button
              type="button"
              className={cn(ctaClass, "w-auto min-w-[9.5rem] shrink-0 px-5")}
              onClick={handleAdd}
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? "..." : "افزودن"}
            </button>
          ) : (
            <button type="button" className={cn(ctaClass, "w-auto shrink-0 px-5")} disabled>
              ناموجود
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
