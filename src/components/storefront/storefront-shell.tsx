import { StoreHeader } from "@/components/storefront/store-header";
import type { ResolvedTheme } from "@selka/theme-sdk";

type StorefrontShellProps = {
  store: { name: string; slug: string };
  theme: ResolvedTheme;
  children: React.ReactNode;
  mainClassName?: string;
};

export function StorefrontShell({ store, theme, children, mainClassName }: StorefrontShellProps) {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <StoreHeader storeName={store.name} storeSlug={store.slug} logo={theme.logo} />
      <main className={mainClassName}>{children}</main>
    </div>
  );
}
