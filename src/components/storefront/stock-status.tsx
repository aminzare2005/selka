import { cn } from "@/lib/utils";

type StockStatusProps = {
  stock: number;
  className?: string;
};

export function StockStatus({ stock, className }: StockStatusProps) {
  const inStock = stock > 0;
  const low = inStock && stock <= 3;

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-sm",
        inStock ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)]",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          !inStock && "bg-[var(--color-muted)]",
          inStock && !low && "bg-emerald-600",
          low && "bg-amber-500",
        )}
        aria-hidden
      />
      {!inStock
        ? "ناموجود"
        : low
          ? `تنها ${stock.toLocaleString("fa-IR")} عدد باقی مانده`
          : "موجود و آماده ارسال"}
    </p>
  );
}
