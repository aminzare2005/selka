import Link from "next/link";
import type { SectionProps } from "@tix/theme-sdk";

export function ShalomHero({ store, settings }: SectionProps) {
  const heroTitle = (settings.heroTitle as string) || store.name;
  const heroSubtitle =
    (settings.heroSubtitle as string) || "یه فروشگاه که واقعاً خودتیه ✨";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf4ff] via-[#faf5ff] to-[#f0fdf4]">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#e879f9]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-[#4ade80]/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-36">
        <p
          className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#a855f7]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          🔥 hot drop
        </p>
        <h1
          className="text-[clamp(3rem,10vw,6rem)] font-black leading-[0.95] tracking-tight text-[#18181b]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heroTitle}
        </h1>
        <p
          className="mt-6 max-w-xl text-xl font-medium text-[#71717a] md:text-2xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {heroSubtitle}
        </p>
        <Link
          href={`/s/${store.slug}#products`}
          className="mt-10 inline-block rounded-full bg-[#18181b] px-10 py-4 text-lg font-bold text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ fontFamily: "var(--font-display)" }}
        >
          بریم بخریم 🛒
        </Link>
      </div>
    </section>
  );
}
