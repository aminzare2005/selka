import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getStoreTheme } from "@/lib/stores";
import { ThemeWrapper } from "@/components/storefront/theme-wrapper";
import { loadThemePackage } from "@/lib/themes/registry";
import { StorefrontAuthForm } from "@/components/storefront/storefront-auth-form";

type Params = { params: Promise<{ slug: string }> };

export default async function StoreLoginPage({ params }: Params) {
  const { slug } = await params;
  const data = await getStoreTheme(slug);
  if (!data) notFound();

  const { store, theme } = data;
  const themePackage = await loadThemePackage(store.themeId);
  const Layout = themePackage.Layout;
  const primary = theme.tokens.colors.primary;

  return (
    <ThemeWrapper theme={theme}>
      <Layout
        store={{ name: store.name, slug: store.slug }}
        theme={theme}
        products={store.products}
        settings={(store.settings as Record<string, unknown>) ?? {}}
        page={{ type: "home" }}
      >
        <Suspense>
          <StorefrontAuthForm
            mode="login"
            store={{ name: store.name, slug: store.slug }}
            primaryColor={primary}
          />
        </Suspense>
      </Layout>
    </ThemeWrapper>
  );
}
