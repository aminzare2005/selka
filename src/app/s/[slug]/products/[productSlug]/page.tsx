import { notFound } from "next/navigation";
import { getProductBySlug, getStoreTheme } from "@/lib/stores";
import { toStorefrontProduct } from "@/lib/storefront/product";
import { ThemeWrapper } from "@/components/storefront/theme-wrapper";
import { StorefrontRenderer } from "@/components/storefront/storefront-renderer";

type Params = { params: Promise<{ slug: string; productSlug: string }> };

export default async function ProductPage({ params }: Params) {
  const { slug, productSlug } = await params;
  const [data, product] = await Promise.all([
    getStoreTheme(slug),
    getProductBySlug(slug, productSlug),
  ]);

  if (!data || !product) notFound();

  const { store, theme } = data;

  return (
    <ThemeWrapper theme={theme}>
      <StorefrontRenderer
        themeId={store.themeId}
        store={{ name: store.name, slug: store.slug }}
        theme={theme}
        products={[]}
        settings={(store.settings as Record<string, unknown>) ?? {}}
        page={{ type: "product", product: toStorefrontProduct(product) }}
      />
    </ThemeWrapper>
  );
}
