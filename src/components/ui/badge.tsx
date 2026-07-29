import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors [&_svg]:h-3 [&_svg]:w-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        brand: "bg-brand-100 text-brand-700",
        destructive: "bg-coral-100 text-coral-800",
        outline: "border border-border bg-card text-foreground",
        success: "bg-mint-100 text-mint-800",
        warning: "bg-sun-100 text-sun-800",
        info: "bg-ocean-100 text-ocean-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
