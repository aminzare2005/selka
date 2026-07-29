import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed",
          "transition-[border-color,box-shadow] duration-200",
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
Textarea.displayName = "Textarea";

export { Textarea };
