import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 [&_svg]:h-6 [&_svg]:w-6">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-h2 text-foreground">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
