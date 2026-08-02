"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Menu, Package, ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";

/** Content height of the toolbar (excluding safe-area inset). */
export const DASHBOARD_MOBILE_TOOLBAR_HEIGHT = "3.5rem";

const toolbarItems = [
  { type: "menu" as const, label: "منو", icon: Menu },
  {
    type: "link" as const,
    href: "/dashboard/products",
    label: "محصولات",
    icon: Package,
  },
  {
    type: "link" as const,
    href: "/dashboard/orders",
    label: "سفارش‌ها",
    icon: ShoppingBag,
  },
  {
    type: "link" as const,
    href: "/dashboard/gallery",
    label: "گالری",
    icon: Images,
  },
  { type: "external" as const, label: "فروشگاه", icon: Store },
] as const;

function isToolbarItemActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type DashboardMobileToolbarProps = {
  storeSlug: string;
  onMenuToggle: () => void;
  menuOpen?: boolean;
};

export function DashboardMobileToolbar({
  storeSlug,
  onMenuToggle,
  menuOpen = false,
}: DashboardMobileToolbarProps) {
  const pathname = usePathname();
  const storefrontHref = storePath(storeSlug);

  return (
    <nav
      className="surface-glass fixed inset-x-0 bottom-0 z-50 border-t border-border/60 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="منوی سریع داشبورد"
    >
      <div className="grid h-14 grid-cols-5">
        {toolbarItems.map((item) => {
          if (item.type === "menu") {
            return (
              <button
                key="menu"
                type="button"
                onClick={onMenuToggle}
                aria-controls="mobile-nav-panel"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
                className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-none text-muted-foreground transition-colors hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          }

          if (item.type === "external") {
            return (
              <a
                key="storefront"
                href={storefrontHref}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-none text-muted-foreground transition-colors hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          }

          const active = isToolbarItemActive(item.href, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-none transition-colors",
                active
                  ? "font-medium text-brand-700"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("h-5 w-5", active && "stroke-[2.25] text-brand-600")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
