import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { storePath } from "@/lib/storefront-url";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { cn } from "@/lib/utils";

type BuyerOrderRowProps = {
  storeSlug: string;
  order: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date | string;
    itemCount?: number;
  };
  className?: string;
};

export function BuyerOrderRow({ storeSlug, order, className }: BuyerOrderRowProps) {
  return (
    <Link
      href={storePath(storeSlug, `/dashboard/orders/${order.id}`)}
      className={cn(
        "group flex items-center justify-between gap-4 py-4 transition-colors",
        "hover:bg-[var(--color-accent)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/20",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[15px] text-[var(--color-foreground)]">
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-muted)]">
          {formatDate(order.createdAt)}
          {typeof order.itemCount === "number" ? (
            <>
              {" · "}
              {order.itemCount.toLocaleString("fa-IR")} قلم
            </>
          ) : null}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <p className="text-[15px] tabular-nums" dir="ltr">
          {formatPrice(order.totalAmount)}
        </p>
        <span
          aria-hidden
          className="text-[var(--color-muted)] transition-transform group-hover:-translate-x-0.5"
        >
          ‹
        </span>
      </div>
    </Link>
  );
}
