"use client";

import type { ProductPageProps } from "@selka/theme-sdk";
import { ProductPageView } from "@/components/storefront/product-page-view";

export function DefaultProductPage(props: ProductPageProps) {
  return (
    <ProductPageView
      {...props}
      classNames={{
        galleryFrame: "rounded-[24px]",
        thumb: "rounded-xl",
        cta: "rounded-full bg-[var(--color-foreground)] active:scale-[0.97]",
        stepper: "rounded-full",
        stickyBar: "rounded-2xl",
      }}
    />
  );
}
