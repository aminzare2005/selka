"use client";

import type { ProductsPageProps } from "@selka/theme-sdk";
import { ProductsPageView } from "@/components/storefront/products-page-view";

export function DefaultProductsPage(props: ProductsPageProps) {
  return (
    <ProductsPageView
      {...props}
      classNames={{
        image: "rounded-[20px]",
        empty: "rounded-[24px] border-0 bg-[var(--color-accent)]",
        title: "font-bold tracking-[-0.02em]",
      }}
    />
  );
}
