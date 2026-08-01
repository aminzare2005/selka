"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartPageProps } from "@selka/theme-sdk";
import { useCart } from "@/hooks/storefront/use-cart";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { PriceDisplay } from "@/components/storefront/price-display";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { productPath, storePath } from "@/lib/storefront-url";
import { cn } from "@/lib/utils";

export type CartPageViewClassNames = {
  root?: string;
  item?: string;
  summary?: string;
  cta?: string;
  stepper?: string;
  image?: string;
};

type CartPageViewProps = CartPageProps & {
  classNames?: CartPageViewClassNames;
};

export function CartPageView({ store, classNames }: CartPageViewProps) {
  const { data, isLoading, updateItem } = useCart(store.slug);
  const items = data?.items ?? [];

  const ctaClass = cn(
    "inline-flex h-12 w-full cursor-pointer items-center justify-center px-6 text-sm font-medium",
    "bg-[var(--color-primary)] text-white transition-opacity duration-200 hover:opacity-90",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
    "rounded-[var(--radius,0.75rem)] touch-manipulation",
    classNames?.cta,
  );

  if (isLoading) {
    return (
      <div className={cn("mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6", classNames?.root)}>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto max-w-4xl px-4 pb-28 pt-6 sm:px-6 sm:pb-16 sm:pt-10",
        classNames?.root,
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <h1
          className="text-2xl font-medium tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          سبد خرید
        </h1>
        {items.length > 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            {items.length.toLocaleString("fa-IR")} قلم
          </p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 border border-dashed border-[var(--color-muted)]/25 px-6 py-16 text-center">
          <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
          <Link href={storePath(store.slug)} className={cn(ctaClass, "mt-8 inline-flex w-auto px-8")}>
            بازگشت به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <ul className="divide-y divide-[var(--color-muted)]/15 border-y border-[var(--color-muted)]/15 lg:col-span-2">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn("flex gap-4 py-5", classNames?.item)}
              >
                <Link
                  href={productPath(store.slug, item.product.slug)}
                  className={cn(
                    "h-24 w-24 shrink-0 overflow-hidden bg-[var(--color-accent)]",
                    classNames?.image,
                  )}
                >
                  {item.product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={productPath(store.slug, item.product.slug)}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {item.product.title}
                      </Link>
                      <PriceDisplay amount={item.product.price} size="sm" className="mt-1" />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: 0 })}
                      className="cursor-pointer p-2 text-[var(--color-muted)] transition-colors hover:text-red-600 touch-manipulation"
                      aria-label={`حذف ${item.product.title}`}
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateItem.mutate({ itemId: item.id, quantity: q })}
                      className={classNames?.stepper}
                    />
                    <p className="text-sm font-medium tabular-nums" dir="ltr">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside
            className={cn(
              "hidden h-fit bg-[var(--color-accent)] p-6 lg:sticky lg:top-24 lg:block",
              classNames?.summary,
            )}
          >
            <p className="text-sm text-[var(--color-muted)]">جمع کل</p>
            <p
              className="mt-2 text-2xl font-medium tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
              dir="ltr"
            >
              {formatPrice(data?.total ?? 0)}
            </p>
            <Link href={storePath(store.slug, "/checkout")} className={cn(ctaClass, "mt-6")}>
              ادامه خرید
            </Link>
            <Link
              href={storePath(store.slug)}
              className="mt-4 block text-center text-sm text-[var(--color-muted)] hover:underline"
            >
              ادامه خرید از فروشگاه
            </Link>
          </aside>
        </div>
      )}

      {items.length > 0 ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-muted)]/15 bg-[var(--color-background)]/95 backdrop-blur-md lg:hidden",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
          )}
        >
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--color-muted)]">جمع کل</p>
              <p className="text-base font-medium tabular-nums" dir="ltr">
                {formatPrice(data?.total ?? 0)}
              </p>
            </div>
            <Link
              href={storePath(store.slug, "/checkout")}
              className={cn(ctaClass, "w-auto min-w-[9.5rem] shrink-0")}
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
