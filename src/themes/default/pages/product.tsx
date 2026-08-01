"use client";

import type { ProductPageProps } from "@selka/theme-sdk";
import { ProductPageView } from "@/components/storefront/product-page-view";

export function DefaultProductPage(props: ProductPageProps) {
  return (
    <ProductPageView
      {...props}
      classNames={{
        galleryFrame: "rounded-none",
        thumb: "rounded-none",
        cta: "rounded-none bg-[var(--color-foreground)]",
        stepper: "rounded-none",
        stickyBar: "rounded-none",
      }}
    />
  );
}
