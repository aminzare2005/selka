"use client";

import type { CartPageProps } from "@selka/theme-sdk";
import { CartPageView } from "@/components/storefront/cart-page-view";

export function ModernCartPage(props: CartPageProps) {
  return (
    <CartPageView
      {...props}
      classNames={{
        cta: "rounded-full",
        stepper: "rounded-full",
        image: "rounded-xl",
        summary: "rounded-2xl",
        item: "sm:rounded-2xl sm:border sm:border-[var(--color-muted)]/10 sm:px-4",
      }}
    />
  );
}
