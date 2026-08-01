import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

type PriceDisplayProps = {
  amount: number;
  compareAt?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function PriceDisplay({ amount, compareAt, className, size = "md" }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-2xl font-semibold tracking-tight",
  };

  const discount =
    compareAt && compareAt > amount
      ? Math.round(((compareAt - amount) / compareAt) * 100)
      : null;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(sizeClasses[size], "text-[var(--color-foreground)]")}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {formatPrice(amount)}
      </span>
      {compareAt && compareAt > amount ? (
        <span className="text-sm text-[var(--color-muted)] line-through">
          {formatPrice(compareAt)}
        </span>
      ) : null}
      {discount ? (
        <span className="text-xs text-[var(--color-muted)]">
          {discount.toLocaleString("fa-IR")}٪ تخفیف
        </span>
      ) : null}
    </div>
  );
}
