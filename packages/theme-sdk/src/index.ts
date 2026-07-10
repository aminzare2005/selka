import type { ComponentType, ReactNode } from "react";

export type ThemeTokens = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  radius: string;
};

export type GoogleFontConfig = {
  family: string;
  weights?: string[];
};

export type ThemeSection = {
  type: string;
  props?: Record<string, unknown>;
};

export type StoreSettings = {
  tokens?: Partial<{
    colors: Partial<ThemeTokens["colors"]>;
    fonts: Partial<ThemeTokens["fonts"]>;
    radius: string;
  }>;
  logo?: string;
  sections?: ThemeSection[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
};

export type ThemeDefinition = {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
  defaultSections: ThemeSection[];
  googleFonts?: GoogleFontConfig[];
};

export type ResolvedTheme = {
  id: string;
  name: string;
  tokens: ThemeTokens;
  sections: ThemeSection[];
  logo?: string;
  googleFonts?: GoogleFontConfig[];
};

export type StorefrontProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
};

export type StorefrontContext = {
  store: { name: string; slug: string };
  theme: ResolvedTheme;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string[];
  }>;
  settings: Record<string, unknown>;
};

export type SectionProps = StorefrontContext & {
  sectionProps?: Record<string, unknown>;
};

export type ProductPageProps = SectionProps & {
  product: StorefrontProduct;
};

export type CartPageProps = SectionProps;

export type CheckoutPageProps = SectionProps;

export type CheckoutResultPageProps = SectionProps & {
  status?: string;
  orderId?: string;
};

export type StorefrontPage =
  | { type: "home" }
  | { type: "product"; product: StorefrontProduct }
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "checkout-result"; status?: string; orderId?: string };

export type ThemePageComponents = {
  ProductPage: ComponentType<ProductPageProps>;
  CartPage: ComponentType<CartPageProps>;
  CheckoutPage: ComponentType<CheckoutPageProps>;
  CheckoutResultPage: ComponentType<CheckoutResultPageProps>;
};

export type ThemeShellComponents = {
  Header: ComponentType<SectionProps>;
  Footer: ComponentType<SectionProps>;
};

export type ThemeComponents = ThemeShellComponents & ThemePageComponents;

export type StorefrontLayoutProps = StorefrontContext & {
  children?: ReactNode;
  /** @deprecated use sectionComponents */
  sections?: Record<string, ComponentType<SectionProps>>;
  sectionComponents?: Record<string, ComponentType<SectionProps>>;
  page?: StorefrontPage;
};

export type ThemePackage = {
  definition: ThemeDefinition;
  Layout: ComponentType<StorefrontLayoutProps>;
  sections: Record<string, ComponentType<SectionProps>>;
  components: ThemeComponents;
};
