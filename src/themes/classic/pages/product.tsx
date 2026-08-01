"use client";

import type { ProductPageProps } from "@selka/theme-sdk";
import { ProductPageView } from "@/components/storefront/product-page-view";

export function ClassicProductPage(props: ProductPageProps) {
  return (
    <ProductPageView
      {...props}
      classNames={{
        root: "max-w-3xl",
        galleryFrame: "rounded-lg border-4 border-[var(--color-primary)]/25",
        thumb: "rounded border-2",
        buyBox: "rounded-lg border-4 border-[var(--color-primary)]/25 bg-[var(--color-accent)]/40 p-6",
        title: "text-center sm:text-start",
        cta: "rounded-full",
        stepper: "rounded-full",
      }}
    />
  );
}
