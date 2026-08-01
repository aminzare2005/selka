"use client";

import type { CartPageProps } from "@selka/theme-sdk";
import { CartPageView } from "@/components/storefront/cart-page-view";

/** Legacy shared cart — themes should use CartPageView directly. */
export function CartPage({ storeSlug }: { storeSlug: string }) {
  const props = {
    store: { name: storeSlug, slug: storeSlug },
    theme: {
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
    },
    products: [],
    settings: {},
  } as CartPageProps;

  return <CartPageView {...props} />;
}
