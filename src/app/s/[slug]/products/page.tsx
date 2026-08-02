import { notFound } from "next/navigation";
import { getStoreTheme } from "@/lib/stores";
import { ThemeWrapper } from "@/components/storefront/theme-wrapper";
import { StorefrontRenderer } from "@/components/storefront/storefront-renderer";

type Params = { params: Promise<{ slug: string }> };

export default async function ProductsRoute({ params }: Params) {
  const { slug } = await params;
  const data = await getStoreTheme(slug);
  if (!data) notFound();

  const { store, theme } = data;

  return (
    <ThemeWrapper theme={theme}>
      <StorefrontRenderer
        themeId={store.themeId}
        store={{ name: store.name, slug: store.slug }}
        theme={theme}
        products={store.products}
        settings={(store.settings as Record<string, unknown>) ?? {}}
        page={{ type: "products" }}
      />
    </ThemeWrapper>
  );
}
