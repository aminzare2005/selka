import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { storePath } from "@/lib/storefront-url";
import { cn } from "@/lib/utils";

type Props = {
  storeSlug: string;
  storeName: string;
  current: string;
  className?: string;
};

export function StorefrontBreadcrumb({ storeSlug, storeName, current, className }: Props) {
  return (
    <nav aria-label="مسیر صفحه" className={cn("text-sm text-[var(--color-muted)]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href={storePath(storeSlug)}
            className="cursor-pointer transition-colors duration-200 hover:text-[var(--color-foreground)]"
          >
            {storeName}
          </Link>
        </li>
        <li aria-hidden className="text-[var(--color-muted)]/50">
          <ChevronLeft className="h-3.5 w-3.5" />
        </li>
        <li className="truncate text-[var(--color-foreground)]" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
