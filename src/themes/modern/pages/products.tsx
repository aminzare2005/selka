"use client";

import type { ProductsPageProps } from "@selka/theme-sdk";
import { ProductsPageView } from "@/components/storefront/products-page-view";

export function ModernProductsPage(props: ProductsPageProps) {
  return (
    <ProductsPageView
      {...props}
      classNames={{
        title: "text-start text-h2",
        count: "text-start",
        root: "py-20",
        grid: "mt-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        empty: "rounded-xl border-0 bg-[var(--color-accent)] py-12",
      }}
    />
  );
}
