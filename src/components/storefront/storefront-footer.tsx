import Link from "next/link";
import type { SectionProps } from "@selka/theme-sdk";
import { cn } from "@/lib/utils";

export type StorefrontFooterClassNames = {
  root?: string;
  inner?: string;
  brand?: string;
  year?: string;
};

type StorefrontFooterProps = Pick<SectionProps, "store"> & {
  classNames?: StorefrontFooterClassNames;
};

export function StorefrontFooter({ store, classNames }: StorefrontFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "mt-auto border-t border-[var(--color-muted)]/12 py-5 sm:py-6",
        classNames?.root,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 sm:px-8",
          classNames?.inner,
        )}
      >
        <Link
          href="/"
          className={cn(
            "text-[13px] font-semibold tracking-tight text-[var(--color-foreground)] transition-opacity hover:opacity-70",
            classNames?.brand,
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {store.name}
          <span className="mx-1.5 font-normal text-[var(--color-muted)]">-</span>
          <span className="font-normal text-[var(--color-muted)]">ساخته شده با سلکا</span>
        </Link>
        <p
          className={cn("text-[12px] tabular-nums text-[var(--color-muted)]", classNames?.year)}
          dir="ltr"
        >
          {year}
        </p>
      </div>
    </footer>
  );
}
