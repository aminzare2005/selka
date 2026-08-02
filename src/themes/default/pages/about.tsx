"use client";

import type { AboutPageProps } from "@selka/theme-sdk";
import { AboutPageView } from "@/components/storefront/about-page-view";

export function DefaultAboutPage(props: AboutPageProps) {
  return (
    <AboutPageView
      {...props}
      classNames={{
        empty: "rounded-[24px] border-0 bg-[var(--color-accent)]",
        title: "font-bold tracking-[-0.02em]",
        root: "px-1",
      }}
    />
  );
}
