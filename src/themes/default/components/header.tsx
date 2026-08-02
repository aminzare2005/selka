"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Menu, X } from "lucide-react";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";
import { StorefrontHeaderActions } from "@/components/storefront/storefront-header-actions";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { path: "", label: "خانه" },
  { path: "/products", label: "محصولات" },
  { path: "/about-us", label: "درباره ما" },
  { path: "/cart", label: "سبد خرید" },
  { path: "/dashboard", label: "حساب من" },
] as const;

function isNavActive(pathname: string, storeSlug: string, path: string) {
  const publicHref = storePath(storeSlug, path || undefined);
  const fsHref = path ? `/s/${storeSlug}${path}` : `/s/${storeSlug}`;
  if (!path) {
    return (
      pathname === publicHref ||
      pathname === fsHref ||
      pathname === `/@${storeSlug}`
    );
  }
  return (
    pathname === publicHref ||
    pathname === fsHref ||
    pathname.startsWith(`${publicHref}/`) ||
    pathname.startsWith(`${fsHref}/`)
  );
}

export function DefaultHeader({ store, theme }: SectionProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const { data: me } = useQuery<{ id?: string } | null>({
    queryKey: ["store-me", store.slug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${store.slug}/me`);
      if (res.status === 401) return null;
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="relative z-50 border-b border-black/[0.04] bg-[var(--color-background)]/72 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--color-background)]/55">
        <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
          {/* Mobile hamburger — first in RTL = right */}
          <button
            type="button"
            className={cn(
              "relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:hidden",
              "text-[var(--color-foreground)] transition-[background-color,transform] duration-150",
              "hover:bg-[var(--color-accent)] active:scale-[0.96]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/20",
              "touch-manipulation",
            )}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5 stroke-[1.5]" />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.5]" />
            )}
          </button>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="منوی اصلی">
            {NAV_LINKS.filter((l) => l.path !== "/cart" && l.path !== "/dashboard").map(
              (link) => {
                const active = isNavActive(pathname, store.slug, link.path);
                return (
                  <Link
                    key={link.path || "home"}
                    href={storePath(store.slug, link.path || undefined)}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[13px] transition-[color,background-color,transform] duration-150 active:scale-[0.97]",
                      active
                        ? "bg-[var(--color-accent)] font-semibold text-[var(--color-foreground)]"
                        : "font-medium text-[var(--color-muted)] hover:bg-[var(--color-accent)]/70 hover:text-[var(--color-foreground)]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              },
            )}
          </nav>

          <Link
            href={storePath(store.slug)}
            className="absolute left-1/2 z-10 max-w-[46%] -translate-x-1/2 truncate text-center text-[20px] font-bold tracking-tight text-[var(--color-foreground)] sm:text-[22px] md:max-w-[50%] md:text-[24px]"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={() => setOpen(false)}
          >
            {theme.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={theme.logo} alt={store.name} className="mx-auto h-7" />
            ) : (
              store.name
            )}
          </Link>

          <div className="relative z-10 ms-auto">
            <StorefrontHeaderActions storeSlug={store.slug} />
          </div>
        </div>
      </div>

      {/* Full-viewport panel under the 4rem header bar */}
      <div
        id={panelId}
        role="dialog"
        aria-modal={open}
        aria-label="منوی فروشگاه"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 md:hidden",
          "bg-[var(--color-background)] transition-[opacity,visibility] duration-300 ease-out",
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <nav
          className="flex h-full flex-col overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
          aria-label="منوی موبایل"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            منو
          </p>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, index) => {
              const href = storePath(store.slug, link.path || undefined);
              const active = isNavActive(pathname, store.slug, link.path);
              return (
                <li key={link.path || "home"}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-4 text-[22px] tracking-[-0.02em]",
                      "touch-manipulation transition-[opacity,transform,color,background-color] duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/20",
                      "active:scale-[0.99]",
                      active
                        ? "bg-[var(--color-accent)] font-bold text-[var(--color-foreground)]"
                        : "font-medium text-[var(--color-muted)] active:bg-[var(--color-accent)] active:text-[var(--color-foreground)]",
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    )}
                    style={{
                      fontFamily: "var(--font-display)",
                      transitionDelay: open ? `${70 + index * 45}ms` : "0ms",
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowLeft
                      className={cn(
                        "h-4 w-4 shrink-0 transition-opacity",
                        active ? "opacity-70" : "opacity-30",
                      )}
                      strokeWidth={1.75}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {!me ? (
            <div className="mt-auto pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <Link
                href={storePath(store.slug, "/login")}
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] text-[13px] font-bold text-[var(--color-background)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
              >
                ورود / ثبت‌نام
              </Link>
            </div>
          ) : (
            <div className="mt-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]" />
          )}
        </nav>
      </div>
    </header>
  );
}
