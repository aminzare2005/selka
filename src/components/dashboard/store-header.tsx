"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditStoreSheet } from "@/components/dashboard/edit-store-sheet";
import type { DashboardStore } from "@/components/dashboard/store-context";

export function StoreHeader({ store }: { store: DashboardStore }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-h2">{store.name}</h1>
        <p className="mt-1 w-fit text-caption" dir="ltr">
          /s/{store.slug}
        </p>
      </div>
      <div className="flex gap-2">
        <EditStoreSheet store={store} />
        <Button variant="outline" size="sm" asChild>
          <Link href={`/s/${store.slug}`} target="_blank">
            مشاهده فروشگاه
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
