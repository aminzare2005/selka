import type { ThemePackage } from "@tix/theme-sdk";
import { createThemeLayout } from "@/themes/shared/create-theme-layout";
import { ClassicHero } from "./sections/hero";
import { ClassicProductGrid } from "./sections/product-grid";
import { ClassicHeader } from "./components/header";
import { ClassicFooter } from "./components/footer";
import { ClassicProductPage } from "./pages/product";
import { ClassicCartPage } from "./pages/cart";
import { ClassicCheckoutPage } from "./pages/checkout";
import { ClassicCheckoutResultPage } from "./pages/checkout-result";

const sectionMap = {
  hero: ClassicHero,
  "product-grid": ClassicProductGrid,
};

const classicTheme: ThemePackage = {
  definition: {
    id: "classic",
    name: "کلاسیک",
    description: "تم کلاسیک با حس سنتی و گرم",
    tokens: {
      colors: {
        primary: "#B45309",
        secondary: "#78350F",
        background: "#FFFBEB",
        foreground: "#292524",
        muted: "#A8A29E",
        accent: "#FEF3C7",
      },
      fonts: {
        display: "Vazirmatn, sans-serif",
        body: "Vazirmatn, sans-serif",
      },
      radius: "4px",
    },
    defaultSections: [
      { type: "hero" },
      { type: "product-grid" },
    ],
  },
  Layout: createThemeLayout({
    Header: ClassicHeader,
    Footer: ClassicFooter,
    ProductPage: ClassicProductPage,
    CartPage: ClassicCartPage,
    CheckoutPage: ClassicCheckoutPage,
    CheckoutResultPage: ClassicCheckoutResultPage,
    sectionMap,
    wrapperClassName: "min-h-screen border-t-4 border-[var(--color-primary)] bg-[var(--color-background)]",
    getMainClassName: (page) => (page.type === "home" ? undefined : "mx-auto max-w-3xl"),
  }),
  sections: sectionMap,
  components: {
    Header: ClassicHeader,
    Footer: ClassicFooter,
    ProductPage: ClassicProductPage,
    CartPage: ClassicCartPage,
    CheckoutPage: ClassicCheckoutPage,
    CheckoutResultPage: ClassicCheckoutResultPage,
  },
};

export default classicTheme;
