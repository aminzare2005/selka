import { ProductCard } from "@/components/storefront/product-card";
import type { SectionProps } from "@marty/theme-sdk";

export function ModernProductGrid({ store, products }: SectionProps) {
  return (
    <section id="products" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="text-h2 text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          محصولات
        </h2>
        {products.length === 0 ? (
          <p className="mt-8 text-[var(--color-muted)]">هنوز محصولی ثبت نشده است.</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]}
                storeSlug={store.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
