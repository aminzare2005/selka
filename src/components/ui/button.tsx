import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-spring",
    // Feedback lands on pointer-down, not on release
    "active:scale-[0.96] active:duration-75",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-brand)] hover:bg-brand-700 hover:shadow-[0_6px_20px_-4px_rgb(109_56_224/0.45)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_14px_-4px_rgb(220_58_78/0.35)] hover:bg-coral-800",
        outline:
          "border border-border bg-card text-foreground shadow-xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        secondary: "bg-secondary text-secondary-foreground hover:bg-brand-100",
        soft: "bg-brand-100 text-brand-700 hover:bg-brand-200",
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-brand-600 underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
