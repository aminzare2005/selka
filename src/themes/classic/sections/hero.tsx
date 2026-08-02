import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SectionProps } from "@selka/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function ClassicHero({ store, settings }: SectionProps) {
  const heroTitle = (settings.heroTitle as string) || store.name;
  const heroSubtitle = (settings.heroSubtitle as string) || "کیفیت اصیل، خرید مطمئن";
  const heroImage = settings.heroImage as string | undefined;

  return (
    <section className="bg-[var(--color-accent)]">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1
          className="text-display text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heroTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-[var(--color-muted)]">{heroSubtitle}</p>
        <Button
          asChild
          className="mt-8 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90"
          size="lg"
        >
          <Link href={storePath(store.slug, "/products")}>ورود به فروشگاه</Link>
        </Button>
        {heroImage && (
          <div className="mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border-2 border-[var(--color-primary)]/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={heroTitle} className="w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
