"use client";

import type { CartPageProps } from "@selka/theme-sdk";
import { CartPageView } from "@/components/storefront/cart-page-view";

export function DefaultCartPage(props: CartPageProps) {
  return (
    <CartPageView
      {...props}
      classNames={{
        cta: "rounded-full bg-[var(--color-foreground)] active:scale-[0.97]",
        stepper: "rounded-full",
        image: "rounded-2xl",
        summary: "rounded-[24px]",
        item: "rounded-2xl",
      }}
    />
  );
}
