"use client";

import type { ProductPageProps } from "@selka/theme-sdk";
import { ProductPageView } from "@/components/storefront/product-page-view";

export function ModernProductPage(props: ProductPageProps) {
  return (
    <ProductPageView
      {...props}
      classNames={{
        galleryFrame: "rounded-2xl",
        thumb: "rounded-xl",
        cta: "rounded-full",
        stepper: "rounded-full",
      }}
    />
  );
}
