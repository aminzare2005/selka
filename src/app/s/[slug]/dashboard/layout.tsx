import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getStoreTheme } from "@/lib/stores";
import { ensureStoreCustomer } from "@/lib/store-customer";
import { ThemeWrapper } from "@/components/storefront/theme-wrapper";
import { loadThemePackage } from "@/lib/themes/registry";
import { BuyerDashboardNav } from "@/components/storefront/buyer-dashboard-nav";
import { storePath } from "@/lib/storefront-url";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function BuyerDashboardLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`${storePath(slug, "/login")}?callbackUrl=${encodeURIComponent(storePath(slug, "/dashboard"))}`);
  }

  const data = await getStoreTheme(slug);
  if (!data) notFound();

  const { store, theme } = data;
  await ensureStoreCustomer(store.id, session.user.id, { name: session.user.name });

  const themePackage = await loadThemePackage(store.themeId);
  const Layout = themePackage.Layout;

  return (
    <ThemeWrapper theme={theme}>
      <Layout
        store={{ name: store.name, slug: store.slug }}
        theme={theme}
        products={store.products}
        settings={(store.settings as Record<string, unknown>) ?? {}}
        page={{ type: "home" }}
      >
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-sm text-[var(--color-muted)]">حساب من در {store.name}</p>
          <h1
            className="mt-1 text-3xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            سلام{session.user.name ? `، ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <div className="mt-6">
            <BuyerDashboardNav storeSlug={store.slug} />
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </Layout>
    </ThemeWrapper>
  );
}
