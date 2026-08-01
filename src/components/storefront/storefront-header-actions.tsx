"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, UserRound } from "lucide-react";
import { storePath } from "@/lib/storefront-url";
import { cn } from "@/lib/utils";

type Props = {
  storeSlug: string;
  className?: string;
};

export function StorefrontHeaderActions({ storeSlug, className }: Props) {
  const { data: cart } = useQuery<{ items?: Array<{ quantity: number }> }>({
    queryKey: ["cart", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/cart`);
      return res.json();
    },
  });

  const { data: me } = useQuery<{ id?: string } | null>({
    queryKey: ["store-me", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/me`);
      if (res.status === 401) return null;
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const count = (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);

  const linkClass = cn(
    "relative inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 px-2",
    "text-sm text-[var(--color-foreground)] transition-opacity duration-200 hover:opacity-70",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
    "touch-manipulation",
  );

  return (
    <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
      <Link
        href={me ? storePath(storeSlug, "/dashboard") : storePath(storeSlug, "/login")}
        className={linkClass}
        aria-label={me ? "حساب من" : "ورود"}
      >
        <UserRound className="h-[18px] w-[18px] stroke-[1.5]" />
        <span className="hidden sm:inline">{me ? "حساب من" : "ورود"}</span>
      </Link>
      <Link
        href={storePath(storeSlug, "/cart")}
        className={linkClass}
        aria-label={count > 0 ? `سبد خرید، ${count} قلم` : "سبد خرید"}
      >
        <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
        <span className="hidden sm:inline">سبد</span>
        {count > 0 ? (
          <span className="absolute top-1 start-1 flex h-4 min-w-4 items-center justify-center bg-[var(--color-foreground)] px-1 text-[10px] font-normal text-[var(--color-background)] sm:static sm:ms-0.5">
            {count.toLocaleString("fa-IR")}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
