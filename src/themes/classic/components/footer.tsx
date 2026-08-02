import type { SectionProps } from "@selka/theme-sdk";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";

export function ClassicFooter(props: SectionProps) {
  return (
    <StorefrontFooter
      store={props.store}
      classNames={{
        root: "mt-12 border-t-4 border-[var(--color-primary)] bg-[var(--color-accent)] py-8",
        inner: "max-w-3xl",
      }}
    />
  );
}
