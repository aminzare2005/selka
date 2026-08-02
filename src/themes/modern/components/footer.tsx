import type { SectionProps } from "@selka/theme-sdk";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";

export function ModernFooter(props: SectionProps) {
  return (
    <StorefrontFooter
      store={props.store}
      classNames={{
        inner: "max-w-6xl",
      }}
    />
  );
}
