"use client";

import type { ProductsPageProps } from "@selka/theme-sdk";
import { ProductsPageView } from "@/components/storefront/products-page-view";

export function ClassicProductsPage(props: ProductsPageProps) {
  return (
    <ProductsPageView
      {...props}
      layout="list"
      classNames={{
        root: "max-w-3xl py-16",
        title: "border-b-2 border-[var(--color-primary)] pb-3 text-start text-h2",
        count: "text-start",
        image: "rounded border-2 border-[var(--color-primary)]/20",
      }}
    />
  );
}
