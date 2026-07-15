import type { ComponentType } from "react";
import type { SectionProps, StorefrontLayoutProps } from "@marty/theme-sdk";
import { ShalomHeader } from "./components/header";
import { ShalomFooter } from "./components/footer";
import { ShalomHero } from "./sections/hero";
import { ShalomProductGrid } from "./sections/product-grid";
import { ShalomProductPage } from "./pages/product";
import { ShalomCartPage } from "./pages/cart";
import { ShalomCheckoutPage } from "./pages/checkout";
import { ShalomCheckoutResultPage } from "./pages/checkout-result";

const sectionMap = {
  hero: ShalomHero,
  "product-grid": ShalomProductGrid,
};

function SectionRenderer({
  sections,
  sectionMap: map,
  context,
}: {
  sections: StorefrontLayoutProps["theme"]["sections"];
  sectionMap: Record<string, ComponentType<SectionProps>>;
  context: SectionProps;
}) {
  const homepageSections = sections.filter((s) => s.type !== "footer");

  return (
    <>
      {homepageSections.map((section, index) => {
        const Component = map[section.type];
        if (!Component) return null;
        return <Component key={`${section.type}-${index}`} {...context} sectionProps={section.props} />;
      })}
    </>
  );
}

export function ShalomLayout({
  store,
  theme,
  products,
  settings,
  page = { type: "home" },
  children,
}: StorefrontLayoutProps) {
  const context: SectionProps = { store, theme, products, settings };

  const content = (() => {
    if (children) return children;

    switch (page.type) {
      case "product":
        return <ShalomProductPage {...context} product={page.product} />;
      case "cart":
        return <ShalomCartPage {...context} />;
      case "checkout":
        return <ShalomCheckoutPage {...context} />;
      case "checkout-result":
        return <ShalomCheckoutResultPage {...context} status={page.status} orderId={page.orderId} />;
      case "home":
      default:
        return <SectionRenderer sections={theme.sections} sectionMap={sectionMap} context={context} />;
    }
  })();

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <ShalomHeader {...context} />
      <main>{content}</main>
      <ShalomFooter {...context} />
    </div>
  );
}
