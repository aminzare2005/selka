import { ProductCard } from "@/components/storefront/product-card";
import type { SectionProps } from "@selka/theme-sdk";

export function ClassicProductGrid({ store, products }: SectionProps) {
  return (
    <section id="products" className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2
          className="border-b-2 border-[var(--color-primary)] pb-3 text-h2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          محصولات
        </h2>
        {products.length === 0 ? (
          <p className="mt-8 text-[var(--color-muted)]">هنوز محصولی ثبت نشده است.</p>
        ) : (
          <div className="mt-8 divide-y divide-[var(--color-muted)]/10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]}
                storeSlug={store.slug}
                layout="list"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
