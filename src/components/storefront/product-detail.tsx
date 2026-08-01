"use client";

import type { ProductPageProps } from "@selka/theme-sdk";
import { ProductPageView } from "@/components/storefront/product-page-view";

/** @deprecated Prefer theme ProductPage or ProductPageView */
export function ProductDetail({
  product,
  storeSlug,
}: {
  product: ProductPageProps["product"];
  storeSlug: string;
}) {
  return (
    <ProductPageView
      product={product}
      store={{ name: storeSlug, slug: storeSlug }}
      theme={
        {
          id: "legacy",
          name: "legacy",
          tokens: {
            colors: {
              primary: "var(--color-primary)",
              secondary: "var(--color-secondary)",
              background: "var(--color-background)",
              foreground: "var(--color-foreground)",
              muted: "var(--color-muted)",
              accent: "var(--color-accent)",
            },
            fonts: { display: "var(--font-display)", body: "var(--font-body)" },
            radius: "var(--radius)",
          },
          sections: [],
        } as ProductPageProps["theme"]
      }
      products={[]}
      settings={{}}
    />
  );
}
