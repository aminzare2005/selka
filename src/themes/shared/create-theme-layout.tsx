import type { ComponentType } from "react";
import type {
  SectionProps,
  StorefrontLayoutProps,
  StorefrontPage,
  ThemePageComponents,
  ThemeShellComponents,
} from "@marty/theme-sdk";
import { SectionRenderer } from "@/components/storefront/section-renderer";

type CreateThemeLayoutOptions = ThemeShellComponents &
  ThemePageComponents & {
    sectionMap: Record<string, ComponentType<SectionProps>>;
    wrapperClassName?: string;
    getMainClassName?: (page: StorefrontPage) => string | undefined;
  };

function homepageSections(sections: StorefrontLayoutProps["theme"]["sections"]) {
  return sections.filter((section) => section.type !== "footer");
}

export function createThemeLayout(options: CreateThemeLayoutOptions) {
  const {
    Header,
    Footer,
    ProductPage,
    CartPage,
    CheckoutPage,
    CheckoutResultPage,
    sectionMap,
    wrapperClassName,
    getMainClassName,
  } = options;

  function ThemeLayout({
    store,
    theme,
    products,
    settings,
    page = { type: "home" },
    children,
  }: StorefrontLayoutProps) {
    const context: SectionProps = { store, theme, products, settings };
    const mainClassName = getMainClassName?.(page);

    const content = (() => {
      if (children) return children;

      switch (page.type) {
        case "product":
          return <ProductPage {...context} product={page.product} />;
        case "cart":
          return <CartPage {...context} />;
        case "checkout":
          return <CheckoutPage {...context} />;
        case "checkout-result":
          return (
            <CheckoutResultPage
              {...context}
              status={page.status}
              orderId={page.orderId}
            />
          );
        case "home":
        default:
          return (
            <SectionRenderer
              sections={homepageSections(theme.sections)}
              sectionMap={sectionMap}
              context={context}
            />
          );
      }
    })();

    return (
      <div className={wrapperClassName ?? "min-h-screen"} style={{ fontFamily: "var(--font-body)" }}>
        <Header {...context} />
        <main className={mainClassName}>{content}</main>
        <Footer {...context} />
      </div>
    );
  }

  return ThemeLayout;
}
