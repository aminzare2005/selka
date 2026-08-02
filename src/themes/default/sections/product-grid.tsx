import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { SectionProps } from "@selka/theme-sdk";
import { ProductCard } from "@/components/storefront/product-card";
import { storePath } from "@/lib/storefront-url";

export function DefaultProductGrid({ store, products }: SectionProps) {
  return (
    <section id="products" className="scroll-mt-24 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <h2
              className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-foreground)] sm:text-[34px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              محصولات
            </h2>
            <p className="mt-2 text-[13px] text-[var(--color-muted)]">
              {products.length.toLocaleString("fa-IR")} مورد در گالری
            </p>
          </div>
          {products.length > 0 ? (
            <Link
              href={storePath(store.slug, "/products")}
              className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-[var(--color-foreground)] transition-[opacity,transform] duration-150 hover:opacity-80 active:scale-[0.97]"
            >
              مشاهده همه
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          ) : null}
        </div>

        {products.length === 0 ? (
          <div className="rounded-[28px] bg-[var(--color-accent)] px-6 py-20 text-center">
            <p className="text-[15px] font-bold text-[var(--color-foreground)]">هنوز محصولی نیست</p>
            <p className="mt-2 text-[13px] text-[var(--color-muted)]">
              به‌محض اضافه شدن، اینجا دیده می‌شود.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
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
                imageClassName="rounded-[20px]"
                className="[&_h3]:font-bold"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
