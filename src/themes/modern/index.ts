import type { ThemePackage } from "@selka/theme-sdk";
import { createThemeLayout } from "@/themes/shared/create-theme-layout";
import { ModernHero } from "./sections/hero";
import { ModernProductGrid } from "./sections/product-grid";
import { ModernHeader } from "./components/header";
import { ModernFooter } from "./components/footer";
import { ModernProductPage } from "./pages/product";
import { ModernCartPage } from "./pages/cart";
import { ModernCheckoutPage } from "./pages/checkout";
import { ModernCheckoutResultPage } from "./pages/checkout-result";

const sectionMap = {
  hero: ModernHero,
  "product-grid": ModernProductGrid,
};

const modernTheme: ThemePackage = {
  definition: {
    id: "modern",
    name: "مدرن",
    description: "تم مدرن با طراحی مینیمال و تمیز",
    tokens: {
      colors: {
        primary: "#0a0a0a",
        secondary: "#525252",
        background: "#ffffff",
        foreground: "#0a0a0a",
        muted: "#737373",
        accent: "#f5f5f5",
      },
      fonts: {
        display: "Vazirmatn, sans-serif",
        body: "Vazirmatn, sans-serif",
      },
      radius: "12px",
    },
    defaultSections: [
      { type: "hero" },
      { type: "product-grid" },
    ],
  },
  Layout: createThemeLayout({
    Header: ModernHeader,
    Footer: ModernFooter,
    ProductPage: ModernProductPage,
    CartPage: ModernCartPage,
    CheckoutPage: ModernCheckoutPage,
    CheckoutResultPage: ModernCheckoutResultPage,
    sectionMap,
  }),
  sections: sectionMap,
  components: {
    Header: ModernHeader,
    Footer: ModernFooter,
    ProductPage: ModernProductPage,
    CartPage: ModernCartPage,
    CheckoutPage: ModernCheckoutPage,
    CheckoutResultPage: ModernCheckoutResultPage,
  },
};

export default modernTheme;
