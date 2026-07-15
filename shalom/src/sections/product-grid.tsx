import Link from "next/link";
import type { SectionProps } from "@marty/theme-sdk";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function ShalomProductGrid({ store, products }: SectionProps) {
  return (
    <section id="products" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2
          className="text-4xl font-black text-[#18181b] md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          چی می‌خوای؟ 🤔
        </h2>
        <p className="mt-2 text-lg text-[#71717a]">همینا رو بردار، پشیمون نمی‌شی</p>

        {products.length === 0 ? (
          <p className="mt-12 text-xl text-[#a1a1aa]">هنوز چیزی نیومده، برگرد بعداً!</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/s/${store.slug}/products/${product.slug}`}
                className="group overflow-hidden rounded-3xl border-2 border-[#e4e4e7] bg-white transition-all duration-200 hover:border-[#a855f7] hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#fdf4ff] to-[#f0fdf4]">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">📦</div>
                  )}
                </div>
                <div className="p-5">
                  <h3
                    className="text-xl font-bold text-[#18181b] group-hover:text-[#a855f7] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {product.title}
                  </h3>
                  <p
                    className="mt-2 text-2xl font-black text-[#a855f7]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
