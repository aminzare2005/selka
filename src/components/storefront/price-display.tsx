import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  amount: number;
  compareAt?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function PriceDisplay({ amount, compareAt, className, size = "md" }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-2xl font-bold",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(sizeClasses[size], "text-[var(--color-primary)]")}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {formatPrice(amount)}
      </span>
      {compareAt && compareAt > amount && (
        <span className="text-sm text-[var(--color-muted)] line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </div>
  );
}
