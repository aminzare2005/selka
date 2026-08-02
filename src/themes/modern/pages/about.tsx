"use client";

import type { AboutPageProps } from "@selka/theme-sdk";
import { AboutPageView } from "@/components/storefront/about-page-view";

export function ModernAboutPage(props: AboutPageProps) {
  return (
    <AboutPageView
      {...props}
      classNames={{
        title: "text-h2",
        empty: "rounded-xl border-0 bg-[var(--color-accent)]",
      }}
    />
  );
}
