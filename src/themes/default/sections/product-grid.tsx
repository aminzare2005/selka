import type { SectionProps } from "@selka/theme-sdk";
import { ProductCard } from "@/components/storefront/product-card";

export function DefaultProductGrid({ store, products }: SectionProps) {
  return (
    <section id="products" className="scroll-mt-20 py-16 sm:py-[72px]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-12 text-center">
          <h2
            className="text-[22px] font-normal leading-[1.31] tracking-tight text-[var(--color-foreground)] sm:text-[30px] sm:leading-[1.2] sm:tracking-[-0.3px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            محصولات
          </h2>
          <p className="mt-3 text-[13px] font-normal text-[var(--color-muted)]">
            {products.length.toLocaleString("fa-IR")} مورد
          </p>
        </div>

        {products.length === 0 ? (
          <p className="border border-dashed border-[#e6e6e6] py-16 text-center text-[13px] text-[var(--color-muted)]">
            هنوز محصولی ثبت نشده است.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]}
                storeSlug={store.slug}
                stock={product.stock}
                imageClassName="rounded-none"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
