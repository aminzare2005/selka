"use client";

import type { AboutPageProps } from "@selka/theme-sdk";
import { AboutPageView } from "@/components/storefront/about-page-view";

export function ClassicAboutPage(props: AboutPageProps) {
  return (
    <AboutPageView
      {...props}
      classNames={{
        root: "max-w-3xl py-16",
        title: "border-b-2 border-[var(--color-primary)] pb-3 text-h2",
        empty: "rounded-lg border-[var(--color-primary)]/20",
      }}
    />
  );
}
