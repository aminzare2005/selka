"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { buildDashboardSections, dashboardNavItems, type NavItem } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";

type Store = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  user: { name: string; email: string; role?: string | null };
  store: Store;
  children: React.ReactNode;
  extraNavItems?: NavItem[];
};

export function StoreDashboardLayout({ user, store, children, extraNavItems }: Props) {
  const baseItems = extraNavItems ?? dashboardNavItems;
  const sections = buildDashboardSections(baseItems, store);

  return (
    <AppShell user={user} sections={sections}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2">{store.name}</h1>
          <p className="mt-1 text-caption" dir="ltr">/s/{store.slug}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/s/${store.slug}`} target="_blank">
            مشاهده فروشگاه
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 animate-fade-in">{children}</div>
    </AppShell>
  );
}
