import { cn } from "@/lib/utils";
import Image from "next/image";

type SelkaBrandMarkProps = {
  name?: string;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  showName?: boolean;
};

export function SelkaBrandMark({
  name = "سلکا",
  className,
  iconClassName,
  nameClassName,
  showName = true,
}: SelkaBrandMarkProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <Image
        src="/selka-logo.png"
        alt="سلکا"
        width={36}
        height={36}
        priority={true}
        className={cn("shrink-0 size-12 md:size-14 object-contain", iconClassName)}
      />
      {showName ? (
        <span
          className={cn(
            "truncate font-display text-lg font-bold tracking-tight text-foreground",
            nameClassName,
          )}
        >
          {name}
        </span>
      ) : null}
    </span>
  );
}
