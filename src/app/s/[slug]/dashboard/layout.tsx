import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getStoreTheme } from "@/lib/stores";
import { ensureStoreCustomer } from "@/lib/store-customer";
import { ThemeWrapper } from "@/components/storefront/theme-wrapper";
import { BuyerAccountShell } from "@/components/storefront/buyer-account-shell";
import { storePath } from "@/lib/storefront-url";
import { toUiIranMobile } from "@/lib/phone";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function BuyerDashboardLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) {
    redirect(
      `${storePath(slug, "/login")}?callbackUrl=${encodeURIComponent(storePath(slug, "/dashboard"))}`,
    );
  }

  const data = await getStoreTheme(slug);
  if (!data) notFound();

  const { store, theme } = data;
  await ensureStoreCustomer(store.id, session.user.id, { name: session.user.name });

  const phone =
    "phoneNumber" in session.user && typeof session.user.phoneNumber === "string"
      ? toUiIranMobile(session.user.phoneNumber)
      : null;

  return (
    <ThemeWrapper theme={theme}>
      <BuyerAccountShell
        store={{ name: store.name, slug: store.slug, logo: theme.logo }}
        user={{ name: session.user.name, phone }}
      >
        {children}
      </BuyerAccountShell>
    </ThemeWrapper>
  );
}
