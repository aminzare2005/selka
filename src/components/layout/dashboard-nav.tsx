import {
  LayoutDashboard,
  Shield,
  CreditCard,
  Palette,
  Package,
  ShoppingBag,
  Images,
  Settings,
} from "lucide-react";

export type NavActiveRule = "exact" | "prefix";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  activeRule?: NavActiveRule;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const dashboardNavItems: NavItem[] = [
  { href: "/dashboard", label: "داشبورد", icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
  { href: "/dashboard/products", label: "محصولات", icon: <Package className="h-4 w-4" /> },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: <ShoppingBag className="h-4 w-4" /> },
  { href: "/dashboard/gallery", label: "گالری", icon: <Images className="h-4 w-4" /> },
  { href: "/dashboard/theme", label: "تم", icon: <Palette className="h-4 w-4" /> },
  { href: "/dashboard/gateways", label: "درگاه‌ها", icon: <CreditCard className="h-4 w-4" /> },
  { href: "/dashboard/settings", label: "تنظیمات", icon: <Settings className="h-4 w-4" /> },
];

export function buildDashboardSections(
  items: NavItem[] = dashboardNavItems,
  extras?: NavItem[],
): NavSection[] {
  const all = extras?.length ? [...items, ...extras] : items;
  return [{ items: all }];
}

export const adminNavItems: NavItem[] = [
  { href: "/admin", label: "آمار", icon: <Shield className="h-4 w-4" />, exact: true },
  { href: "/admin/gateways", label: "درگاه‌ها", icon: <CreditCard className="h-4 w-4" /> },
];
