import { cn } from "@/lib/utils";
import { toneSurface, type Tone } from "@/components/ui/tone";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: Tone;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "brand",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "animate-pop-in flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-3xl [&_svg]:h-7 [&_svg]:w-7",
          toneSurface[tone],
        )}
      >
        {icon}
      </div>
      <p className="mt-5 text-base font-bold">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
