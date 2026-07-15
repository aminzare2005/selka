import type { SectionProps } from "@marty/theme-sdk";

export function ShalomHeader({ store, theme }: SectionProps) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#e4e4e7] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a
          href={`/s/${store.slug}`}
          className="text-2xl font-black text-[#18181b]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {theme.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={theme.logo} alt={store.name} className="h-9" />
          ) : (
            store.name
          )}
        </a>
        <nav className="flex items-center gap-4 text-sm font-bold">
          <a
            href={`/s/${store.slug}`}
            className="hover:text-[#a855f7] transition-colors"
          >
            خانه
          </a>
          <a
            href={`/s/${store.slug}#products`}
            className="hidden sm:inline hover:text-[#a855f7] transition-colors"
          >
            محصولات
          </a>
          <a
            href={`/s/${store.slug}/cart`}
            className="rounded-full bg-[#18181b] px-4 py-2 text-white hover:scale-105 transition-transform"
          >
            سبد 🛒
          </a>
        </nav>
      </div>
    </header>
  );
}
