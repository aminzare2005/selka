"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import type { NavItem, NavSection } from "@/components/layout/dashboard-nav";

export type { NavItem, NavSection } from "@/components/layout/dashboard-nav";

function isItemActive(item: NavItem, pathname: string) {
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

export function AppSidebar({
  sections,
  user,
  brand = "سلکا",
  brandHref = "/dashboard",
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setMobileOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (item: NavItem) => isItemActive(item, pathname);

  const brandMark = (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[var(--shadow-brand)]">
        <Sparkles className="h-[18px] w-[18px]" />
      </span>
      <span className="font-display text-lg font-extrabold">{brand}</span>
    </span>
  );

  const navLinks = (opts?: { onNavigate?: () => void; compact?: boolean }) =>
    sections.map((section, index) => (
      <div key={section.title ?? index} className="space-y-1">
        {section.title && (
          <p className="mb-2 truncate px-3 text-xs font-semibold text-muted-foreground">
            {section.title}
          </p>
        )}
        {section.items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={opts?.onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 text-sm font-medium",
                "transition-[background-color,color] duration-200 ease-out",
                opts?.compact ? "py-3" : "py-2.5",
                active
                  ? "bg-brand-100 text-brand-700"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "transition-colors duration-200",
                  active
                    ? "text-brand-600"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    ));

  const userCard = (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
          {user.email}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full justify-between rounded-xl bg-secondary hover:bg-coral-100 hover:text-coral-800"
        onClick={handleLogout}
      >
        خروج از حساب
        <LogOut className="h-4 w-4 -scale-x-100" />
      </Button>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="surface-glass flex h-16 items-center justify-between gap-3 px-4">
          {/* First in RTL = right side */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href={brandHref} className="min-w-0" onClick={() => setMobileOpen(false)}>
            {brandMark}
          </Link>
        </div>

        {/* Full-height panel under header */}
        {mobileOpen && (
          <div
            id="mobile-nav-panel"
            className="flex h-[calc(100dvh-4rem)] flex-col bg-background animate-fade-in"
          >
            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-3">
              {navLinks({ onNavigate: () => setMobileOpen(false), compact: true })}
            </nav>
            <div className="shrink-0 border-t border-border/80 bg-secondary/40 p-3">
              {userCard}
            </div>
          </div>
        )}
      </header>

      {/* ── Desktop sidebar ── */}
      <aside className="brand-wash fixed inset-y-0 right-0 z-40 hidden h-full w-64 flex-col border-l border-border/70 bg-background lg:flex">
        <div className="flex h-18 items-center px-5">
          <Link href={brandHref}>{brandMark}</Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">{navLinks()}</nav>

        <div className="border-t border-border/80 bg-secondary/50 p-3">{userCard}</div>
      </aside>
    </>
  );
}
