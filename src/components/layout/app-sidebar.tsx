"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import type { NavItem, NavSection } from "@/components/layout/dashboard-nav";

export type { NavItem, NavSection } from "@/components/layout/dashboard-nav";

function isItemActive(item: NavItem, pathname: string) {
  if (item.activeRule === "dashboard-stores-list") {
    return (
      pathname === "/dashboard" ||
      pathname === "/dashboard/stores" ||
      pathname === "/dashboard/stores/new"
    );
  }
  if (item.exact || item.activeRule === "exact") {
    return pathname === item.href;
  }
  return pathname.startsWith(item.href);
}

type AppSidebarProps = {
  sections: NavSection[];
  user: { name: string; email: string };
  brand?: string;
  brandHref?: string;
};

export function AppSidebar({ sections, user, brand = "تیکس", brandHref = "/dashboard" }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (item: NavItem) => isItemActive(item, pathname);

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={brandHref} className="font-display text-lg font-bold tracking-tight">
          {brand}
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {sections.map((section, index) => (
          <div key={section.title ?? index} className="space-y-1">
            {section.title && (
              <p className="mb-2 truncate px-3 text-xs font-medium text-muted-foreground">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate" dir="ltr">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          خروج
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href={brandHref} className="font-display font-bold">{brand}</Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 flex h-full w-64 flex-col border-l border-border bg-background transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
