import {
  LayoutDashboard,
  Store,
  Shield,
  CreditCard,
  Palette,
  Package,
  ShoppingBag,
} from "lucide-react";

export type NavActiveRule = "exact" | "prefix" | "dashboard-stores-list";

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
  {
    href: "/dashboard/stores",
    label: "فروشگاه‌ها",
    icon: <Store className="h-4 w-4" />,
    exact: true,
  },
];

export function getStoreNavItems(storeId: string): NavItem[] {
  const base = `/dashboard/stores/${storeId}`;
  return [
    { href: base, label: "نمای کلی", icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
    { href: `${base}/theme`, label: "تم", icon: <Palette className="h-4 w-4" /> },
    { href: `${base}/products`, label: "محصولات", icon: <Package className="h-4 w-4" /> },
    { href: `${base}/gateways`, label: "درگاه‌ها", icon: <CreditCard className="h-4 w-4" /> },
    { href: `${base}/orders`, label: "سفارش‌ها", icon: <ShoppingBag className="h-4 w-4" /> },
  ];
}

export function buildDashboardSections(
  items: NavItem[] = dashboardNavItems,
  store?: { id: string; name: string },
): NavSection[] {
  const sections: NavSection[] = [{ items }];
  if (store) {
    sections.push({ title: store.name, items: getStoreNavItems(store.id) });
  }
  return sections;
}

export const adminNavItems: NavItem[] = [
  { href: "/admin", label: "آمار", icon: <Shield className="h-4 w-4" />, exact: true },
  { href: "/admin/gateways", label: "درگاه‌ها", icon: <CreditCard className="h-4 w-4" /> },
];
