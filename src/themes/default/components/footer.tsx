import type { SectionProps } from "@selka/theme-sdk";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";

export function DefaultFooter(props: SectionProps) {
  return (
    <StorefrontFooter
      store={props.store}
      classNames={{
        root: "border-0 bg-[var(--color-foreground)] py-6",
        brand: "text-[var(--color-background)] hover:opacity-80 [&_span]:text-white/55",
        year: "text-white/45",
      }}
    />
  );
}
