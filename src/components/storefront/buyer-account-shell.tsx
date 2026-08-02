"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ClipboardList,
  LogOut,
  Package,
  Store,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { toast } from "sonner";

const navItems = [
  {
    href: "/dashboard",
    label: "نمای کلی",
    description: "وضعیت حساب و سفارش‌های اخیر",
    icon: ClipboardList,
    exact: true,
  },
  {
    href: "/dashboard/orders",
    label: "سفارش‌ها",
    description: "پیگیری خریدها",
    icon: Package,
    exact: false,
  },
  {
    href: "/dashboard/profile",
    label: "اطلاعات تحویل",
    description: "نام، تلفن و آدرس",
    icon: UserRound,
    exact: false,
  },
] as const;

type BuyerAccountShellProps = {
  store: { name: string; slug: string; logo?: string };
  user: { name?: string | null; phone?: string | null };
  children: React.ReactNode;
};

function isActive(pathname: string, storeSlug: string, href: string, exact: boolean) {
  const publicHref = `${storePath(storeSlug)}${href}`;
  const fsHref = `/s/${storeSlug}${href}`;
  if (exact) {
    return pathname === publicHref || pathname === fsHref;
  }
  return pathname.includes(href);
}

export function BuyerAccountShell({ store, user, children }: BuyerAccountShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shopHref = storePath(store.slug);
  const displayName = user.name?.trim() || "خریدار";

  async function logout() {
    await authClient.signOut();
    toast.success("خارج شدی");
    router.push(shopHref);
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* System top bar — account chrome, not storefront marketing header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-muted)]/20 bg-[var(--color-background)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={shopHref}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-foreground)] transition-opacity hover:opacity-80"
              aria-label="بازگشت به فروشگاه"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-[var(--color-muted)]">حساب خریدار</p>
              <p
                className="truncate text-[15px] font-medium tracking-tight sm:text-base"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {store.name}
              </p>
            </div>
          </div>

          <div className="hidden min-w-0 items-center gap-4 sm:flex">
            <div className="min-w-0 text-end">
              <p className="truncate text-[13px] font-medium">{displayName}</p>
              {user.phone ? (
                <p className="truncate text-[12px] text-[var(--color-muted)]" dir="ltr">
                  {user.phone}
                </p>
              ) : null}
            </div>
            <Link
              href={shopHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-muted)]/25 px-3 py-1.5 text-[12px] text-[var(--color-muted)] transition-colors hover:border-[var(--color-foreground)]/30 hover:text-[var(--color-foreground)]"
            >
              <Store className="h-3.5 w-3.5" />
              فروشگاه
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0 px-0 sm:gap-8 sm:px-6 sm:py-8 lg:gap-10">
        {/* Desktop sidebar — system account nav */}
        <aside className="hidden w-56 shrink-0 sm:block lg:w-64">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-[var(--color-muted)]/15 bg-[var(--color-accent)]/40 p-4">
              <p className="text-[12px] text-[var(--color-muted)]">وارد شده به‌عنوان</p>
              <p className="mt-1 truncate text-[14px] font-medium">{displayName}</p>
              {user.phone ? (
                <p className="mt-0.5 truncate text-[12px] text-[var(--color-muted)]" dir="ltr">
                  {user.phone}
                </p>
              ) : null}
            </div>

            <nav className="space-y-1" aria-label="منوی حساب">
              {navItems.map((item) => {
                const active = isActive(pathname, store.slug, item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={`${shopHref}${item.href}`}
                    className={cn(
                      "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      active
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "text-[var(--color-foreground)] hover:bg-[var(--color-accent)]",
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium">{item.label}</span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[11px] leading-snug",
                          active ? "text-[var(--color-background)]/70" : "text-[var(--color-muted)]",
                        )}
                      >
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-0 sm:pb-10 sm:pt-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — primary account IA */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-muted)]/20 bg-[var(--color-background)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
        aria-label="منوی حساب موبایل"
      >
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active = isActive(pathname, store.slug, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={`${shopHref}${item.href}`}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-2.5 text-[10px]",
                  active ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)]",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
                <span className={cn(active && "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] text-[var(--color-muted)]"
          >
            <LogOut className="h-5 w-5" />
            <span>خروج</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
