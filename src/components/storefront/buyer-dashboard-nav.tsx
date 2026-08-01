"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { toast } from "sonner";

const links = [
  { href: "/dashboard", label: "خلاصه", exact: true },
  { href: "/dashboard/orders", label: "سفارش‌ها" },
  { href: "/dashboard/profile", label: "پروفایل" },
] as const;

type BuyerDashboardNavProps = {
  storeSlug: string;
};

export function BuyerDashboardNav({ storeSlug }: BuyerDashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const base = storePath(storeSlug);

  async function logout() {
    await authClient.signOut();
    toast.success("خارج شدی");
    router.push(base);
    router.refresh();
  }

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-[var(--color-muted)]/15 pb-4">
      {links.map((link) => {
        const href = `${base}${link.href}`;
        const active = "exact" in link && link.exact
          ? pathname === href || pathname === `/s/${storeSlug}${link.href}`
          : pathname.includes(link.href);
        return (
          <Link
            key={link.href}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-accent)] text-[var(--color-foreground)] hover:opacity-90",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="ms-auto rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        خروج
      </button>
    </nav>
  );
}
