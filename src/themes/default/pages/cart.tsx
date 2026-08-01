"use client";

import type { CartPageProps } from "@selka/theme-sdk";
import { CartPageView } from "@/components/storefront/cart-page-view";

export function DefaultCartPage(props: CartPageProps) {
  return (
    <CartPageView
      {...props}
      classNames={{
        cta: "rounded-none bg-[var(--color-foreground)]",
        stepper: "rounded-none",
        image: "rounded-none",
        summary: "rounded-none",
      }}
    />
  );
}
