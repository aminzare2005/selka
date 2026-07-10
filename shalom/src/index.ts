import type { ThemePackage } from "@tix/theme-sdk";
import { ShalomLayout } from "./layout";
import { ShalomHero } from "./sections/hero";
import { ShalomProductGrid } from "./sections/product-grid";
import { ShalomHeader } from "./components/header";
import { ShalomFooter } from "./components/footer";
import { ShalomProductPage } from "./pages/product";
import { ShalomCartPage } from "./pages/cart";
import { ShalomCheckoutPage } from "./pages/checkout";
import { ShalomCheckoutResultPage } from "./pages/checkout-result";

const sectionMap = {
  hero: ShalomHero,
  "product-grid": ShalomProductGrid,
};

const shalomTheme: ThemePackage = {
  definition: {
    id: "shalom",
    name: "شالوم",
    description: "تم جن‌زی رنگارنگ با فونت Rubik و تایپوگرافی بزرگ",
    tokens: {
      colors: {
        primary: "#a855f7",
        secondary: "#18181b",
        background: "#ffffff",
        foreground: "#18181b",
        muted: "#71717a",
        accent: "#fdf4ff",
      },
      fonts: {
        display: "'Rubik', sans-serif",
        body: "'Rubik', sans-serif",
      },
      radius: "24px",
    },
    defaultSections: [
      { type: "hero" },
      { type: "product-grid" },
    ],
    googleFonts: [{ family: "Rubik", weights: ["400", "500", "700", "900"] }],
  },
  Layout: ShalomLayout,
  sections: sectionMap,
  components: {
    Header: ShalomHeader,
    Footer: ShalomFooter,
    ProductPage: ShalomProductPage,
    CartPage: ShalomCartPage,
    CheckoutPage: ShalomCheckoutPage,
    CheckoutResultPage: ShalomCheckoutResultPage,
  },
};

export default shalomTheme;
