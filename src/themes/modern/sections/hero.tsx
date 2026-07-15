import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SectionProps } from "@marty/theme-sdk";
import { storePath } from "@/lib/storefront-url";

export function ModernHero({ store, settings }: SectionProps) {
  const heroTitle = (settings.heroTitle as string) || store.name;
  const heroSubtitle = (settings.heroSubtitle as string) || "به فروشگاه ما خوش آمدید";
  const heroImage = settings.heroImage as string | undefined;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl animate-slide-up">
          <h1
            className="text-display text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">{heroSubtitle}</p>
          <Button
            asChild
            className="mt-8 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90"
            size="lg"
          >
            <Link href={`${storePath(store.slug)}#products`}>مشاهده محصولات</Link>
          </Button>
        </div>
        {heroImage && (
          <div className="mt-12 aspect-[16/7] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={heroTitle} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
