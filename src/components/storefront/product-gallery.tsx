"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
  frameClassName?: string;
  thumbClassName?: string;
};

export function ProductGallery({
  images,
  alt,
  className,
  frameClassName,
  thumbClassName,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const list = images.length > 0 ? images : [];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || list.length <= 1) return;

    const onScroll = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const index = Math.round(el.scrollLeft / width);
      setActive(Math.min(Math.max(index, 0), list.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [list.length]);

  function goTo(index: number) {
    setActive(index);
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  if (list.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-[4/5] items-center justify-center bg-[var(--color-accent)] text-sm text-[var(--color-muted)] sm:aspect-square",
          frameClassName,
          className,
        )}
      >
        بدون تصویر
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={scrollerRef}
        className={cn(
          "flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-[var(--color-accent)] sm:aspect-square",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          frameClassName,
        )}
        dir="ltr"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
      >
        <span id={labelId} className="sr-only">
          تصاویر {alt}
        </span>
        {list.map((src, index) => (
          <div key={src} className="h-full w-full shrink-0 snap-center snap-always">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={list.length > 1 ? `${alt} — تصویر ${index + 1}` : alt}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {list.length > 1 ? (
        <>
          <div className="flex justify-center gap-2 sm:hidden" role="tablist" aria-label="انتخاب تصویر">
            {list.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`تصویر ${index + 1}`}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-colors duration-200 touch-manipulation",
                  index === active
                    ? "bg-[var(--color-foreground)]"
                    : "bg-[var(--color-muted)]/35",
                )}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          <div className="hidden gap-2 overflow-x-auto sm:flex" role="tablist" aria-label="تصاویر محصول">
            {list.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === active}
                onClick={() => goTo(index)}
                className={cn(
                  "h-16 w-16 shrink-0 cursor-pointer overflow-hidden border-2 transition-opacity duration-200 touch-manipulation",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)]/30",
                  index === active
                    ? "border-[var(--color-foreground)] opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                  thumbClassName,
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
