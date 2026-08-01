"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: "md" | "lg";
};

/** Accessible stepper with 44px touch targets (UI UX PRO MAX). */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = "md",
}: QuantityStepperProps) {
  const btn = size === "lg" ? "h-11 w-11" : "h-10 w-10";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border border-[var(--color-muted)]/25 p-1",
        "rounded-[var(--radius,0.75rem)]",
        className,
      )}
      role="group"
      aria-label="تعداد"
    >
      <button
        type="button"
        className={cn(
          btn,
          "inline-flex cursor-pointer items-center justify-center rounded-[calc(var(--radius,0.75rem)-2px)]",
          "text-[var(--color-foreground)] transition-colors duration-200",
          "hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "touch-manipulation",
        )}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="کاهش تعداد"
      >
        <Minus className="h-4 w-4 stroke-[1.75]" />
      </button>
      <span
        className="min-w-10 text-center text-sm tabular-nums text-[var(--color-foreground)]"
        aria-live="polite"
      >
        {value.toLocaleString("fa-IR")}
      </span>
      <button
        type="button"
        className={cn(
          btn,
          "inline-flex cursor-pointer items-center justify-center rounded-[calc(var(--radius,0.75rem)-2px)]",
          "text-[var(--color-foreground)] transition-colors duration-200",
          "hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "touch-manipulation",
        )}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="افزایش تعداد"
      >
        <Plus className="h-4 w-4 stroke-[1.75]" />
      </button>
    </div>
  );
}
