import { loadThemePackage } from "@/lib/themes/registry";
import type { ResolvedTheme, StorefrontPage } from "@/lib/themes/types";
import type { Product } from "@/generated/prisma/client";

type StorefrontRendererProps = {
  themeId: string;
  store: { name: string; slug: string };
  theme: ResolvedTheme;
  products: Product[];
  settings: Record<string, unknown>;
  page?: StorefrontPage;
};

export async function StorefrontRenderer({
  themeId,
  store,
  theme,
  products,
  settings,
  page = { type: "home" },
}: StorefrontRendererProps) {
  const themePackage = await loadThemePackage(themeId);
  const Layout = themePackage.Layout;

  return (
    <Layout
      store={store}
      theme={theme}
      products={products}
      settings={settings}
      page={page}
      sectionComponents={themePackage.sections}
    />
  );
}
