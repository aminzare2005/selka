"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, Store, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toUiIranMobile } from "@/lib/phone";
import { storePath } from "@/lib/storefront-url";
import { Button } from "@/components/ui/button";
import type { NavItem, NavSection } from "@/components/layout/dashboard-nav";
import {
  DASHBOARD_MOBILE_TOOLBAR_HEIGHT,
  DashboardMobileToolbar,
} from "@/components/layout/dashboard-mobile-toolbar";
import { SelkaBrandMark } from "@/components/layout/selka-brand-mark";

export type { NavItem, NavSection } from "@/components/layout/dashboard-nav";

function isItemActive(item: NavItem, pathname: string) {
  if (item.exact || item.activeRule === "exact") {
    return pathname === item.href;
  }
  return pathname.startsWith(item.href);
}

type AppSidebarProps = {
  sections: NavSection[];
  user: { name: string; phoneNumber?: string | null; email?: string | null };
  brand?: string;
  brandHref?: string;
  /** When set, mobile uses bottom toolbar (menu + shortcuts) instead of header hamburger. */
  storeSlug?: string | null;
};

export function AppSidebar({
  sections,
  user,
  brand = "سلکا",
  brandHref = "/dashboard",
  storeSlug,
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
  const useMobileToolbar = Boolean(storeSlug);

  const brandMark = <SelkaBrandMark showName={false} />;

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

  const viewShopLink = storeSlug ? (
    <a
      href={storePath(storeSlug)}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-2xl",
        "bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
        "shadow-[var(--shadow-brand)]",
        "transition-[transform,background-color,box-shadow] duration-200 ease-spring",
        "hover:bg-brand-700 hover:shadow-[0_6px_20px_-4px_rgb(109_56_224/0.45)]",
        "active:scale-[0.97] active:duration-75",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)]">
          <Store className="h-4 w-4" aria-hidden />
        </span>
        <span className="truncate">دیدن فروشگاه</span>
      </span>
      <ExternalLink
        className="h-4 w-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </a>
  ) : null;

  const userCard = (
    <div className="overflow-hidden rounded-md border border-border/80 bg-card shadow-xs">
      <div className="px-4 py-3">
        <p className="truncate text-sm font-semibold leading-snug tracking-tight text-foreground">
          {user.name}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
          {toUiIranMobile(user.phoneNumber) || "—"}
        </p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          "flex w-full items-center justify-center gap-2 border-t border-border/70",
          "bg-secondary/40 px-4 py-2.5 text-sm font-medium text-muted-foreground",
          "transition-[transform,background-color,color] duration-200 ease-spring",
          "hover:bg-coral-100 hover:text-coral-800",
          "active:scale-[0.97] active:duration-75",
        )}
      >
        <LogOut className="h-4 w-4 -scale-x-100" aria-hidden />
        خروج از حساب
      </button>
    </div>
  );

  const sidebarFooter = (
    <div className="space-y-3">
      {viewShopLink}
      {userCard}
    </div>
  );

  const mobileFooterShell = cn(
    "shrink-0 border-t border-border/80 bg-card/90 px-3",
    useMobileToolbar ? "pt-3 pb-0" : "py-3",
  );
  const desktopFooterShell = "shrink-0 border-t border-border/80 bg-card/90 px-3 py-3";

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
        <div
          className={cn(
            "surface-glass flex h-16 items-center border-b border-border/60 px-4",
            useMobileToolbar ? "justify-center" : "justify-between gap-3",
          )}
        >
          {!useMobileToolbar ? (
            <>
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

              <div aria-hidden className="w-10 shrink-0" />
            </>
          ) : (
            <Link href={brandHref} className="min-w-0" onClick={() => setMobileOpen(false)}>
              {brandMark}
            </Link>
          )}
        </div>

        {/* Full-height panel under header — sits flush on the bottom toolbar when present */}
        {mobileOpen && (
          <div
            id="mobile-nav-panel"
            className="fixed inset-x-0 top-16 z-50 flex flex-col bg-background animate-fade-in"
            style={{
              bottom: useMobileToolbar
                ? `calc(${DASHBOARD_MOBILE_TOOLBAR_HEIGHT} + env(safe-area-inset-bottom))`
                : 0,
            }}
          >
            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-3">
              {navLinks({ onNavigate: () => setMobileOpen(false), compact: true })}
            </nav>
            <div className={mobileFooterShell}>{sidebarFooter}</div>
          </div>
        )}
      </header>

      {useMobileToolbar && storeSlug ? (
        <DashboardMobileToolbar
          storeSlug={storeSlug}
          menuOpen={mobileOpen}
          onMenuToggle={() => setMobileOpen((open) => !open)}
        />
      ) : null}

      {/* ── Desktop sidebar ── */}
      <aside className="brand-wash fixed inset-y-0 right-0 z-40 hidden h-full w-64 flex-col border-l border-border/70 bg-background lg:flex">
        <div className="flex h-18 items-center px-5">
          <Link href={brandHref}>{brandMark}</Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">{navLinks()}</nav>

        <div className={desktopFooterShell}>{sidebarFooter}</div>
      </aside>
    </>
  );
}
