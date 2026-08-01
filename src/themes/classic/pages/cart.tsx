"use client";

import type { CartPageProps } from "@selka/theme-sdk";
import { CartPageView } from "@/components/storefront/cart-page-view";

export function ClassicCartPage(props: CartPageProps) {
  return (
    <CartPageView
      {...props}
      classNames={{
        root: "max-w-3xl",
        cta: "rounded-full",
        stepper: "rounded-full",
        image: "rounded border-2 border-[var(--color-primary)]/20",
        summary: "rounded-lg border-4 border-[var(--color-primary)] text-center",
        item: "border-[var(--color-primary)]/15",
      }}
    />
  );
}
