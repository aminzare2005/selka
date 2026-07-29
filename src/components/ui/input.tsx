import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm",
          "transition-[border-color,box-shadow] duration-200",
          "file:me-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground/60 hover:border-brand-300",
          "focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
