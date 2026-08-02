import type { ThemePackage } from "@selka/theme-sdk";
import { createThemeLayout } from "@/themes/shared/create-theme-layout";
import { DefaultHero } from "./sections/hero";
import { DefaultProductGrid } from "./sections/product-grid";
import { DefaultTrustStrip } from "./sections/trust-strip";
import { DefaultHeader } from "./components/header";
import { DefaultFooter } from "./components/footer";
import { DefaultProductPage } from "./pages/product";
import { DefaultProductsPage } from "./pages/products";
import { DefaultAboutPage } from "./pages/about";
import { DefaultCartPage } from "./pages/cart";
import { DefaultCheckoutPage } from "./pages/checkout";
import { DefaultCheckoutResultPage } from "./pages/checkout-result";

const sectionMap = {
  hero: DefaultHero,
  "product-grid": DefaultProductGrid,
  "trust-strip": DefaultTrustStrip,
};

const defaultTheme: ThemePackage = {
  definition: {
    id: "default",
    name: "پیش‌فرض",
    description: "گالری مینیمال سفید — تایپوگرافی‌محور، بدون رنگ تزئینی، حس اپل/فشن ادیتوریال",
    tokens: {
      colors: {
        primary: "#222222",
        secondary: "#727272",
        background: "#ffffff",
        foreground: "#222222",
        muted: "#727272",
        accent: "#f5f5f5",
      },
      fonts: {
        display: "Vazirmatn, ui-sans-serif, system-ui, sans-serif",
        body: "Vazirmatn, ui-sans-serif, system-ui, sans-serif",
      },
      radius: "16px",
    },
    defaultSections: [{ type: "hero" }, { type: "trust-strip" }, { type: "product-grid" }],
    googleFonts: [{ family: "Vazirmatn", weights: ["400", "500", "700", "800"] }],
  },
  Layout: createThemeLayout({
    Header: DefaultHeader,
    Footer: DefaultFooter,
    ProductPage: DefaultProductPage,
    ProductsPage: DefaultProductsPage,
    AboutPage: DefaultAboutPage,
    CartPage: DefaultCartPage,
    CheckoutPage: DefaultCheckoutPage,
    CheckoutResultPage: DefaultCheckoutResultPage,
    sectionMap,
    wrapperClassName:
      "flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)] antialiased [font-feature-settings:'ss01']",
  }),
  sections: sectionMap,
  components: {
    Header: DefaultHeader,
    Footer: DefaultFooter,
    ProductPage: DefaultProductPage,
    ProductsPage: DefaultProductsPage,
    AboutPage: DefaultAboutPage,
    CartPage: DefaultCartPage,
    CheckoutPage: DefaultCheckoutPage,
    CheckoutResultPage: DefaultCheckoutResultPage,
  },
};

export default defaultTheme;
