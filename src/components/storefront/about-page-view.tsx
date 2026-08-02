import type { AboutPageProps } from "@selka/theme-sdk";
import { cn } from "@/lib/utils";

export type AboutPageViewClassNames = {
  root?: string;
  title?: string;
  body?: string;
  empty?: string;
};

type AboutPageViewProps = AboutPageProps & {
  classNames?: AboutPageViewClassNames;
};

export function AboutPageView({ settings, classNames }: AboutPageViewProps) {
  const aboutText =
    typeof settings.aboutText === "string" ? settings.aboutText.trim() : "";

  return (
    <section className={cn("py-16 sm:py-20", classNames?.root)}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h1
          className={cn(
            "text-[22px] font-normal leading-tight tracking-tight text-[var(--color-foreground)] sm:text-[30px]",
            classNames?.title,
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          درباره ما
        </h1>

        {aboutText ? (
          <p
            className={cn(
              "mt-8 whitespace-pre-wrap text-[15px] leading-[1.85] text-[var(--color-foreground)]/90",
              classNames?.body,
            )}
          >
            {aboutText}
          </p>
        ) : (
          <p
            className={cn(
              "mt-8 border border-dashed border-[var(--color-muted)]/25 py-12 text-center text-[13px] text-[var(--color-muted)]",
              classNames?.empty,
            )}
          >
            هنوز متنی نوشته نشده.
          </p>
        )}
      </div>
    </section>
  );
}
