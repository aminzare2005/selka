import type { ProductsPageProps } from "@selka/theme-sdk";
import { ProductCard } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";

export type ProductsPageViewClassNames = {
  root?: string;
  title?: string;
  count?: string;
  empty?: string;
  grid?: string;
  image?: string;
};

type ProductsPageViewProps = ProductsPageProps & {
  layout?: "grid" | "list";
  classNames?: ProductsPageViewClassNames;
};

export function ProductsPageView({
  store,
  products,
  layout = "grid",
  classNames,
}: ProductsPageViewProps) {
  return (
    <section className={cn("py-16 sm:py-20", classNames?.root)}>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h1
            className={cn(
              "text-[22px] font-normal leading-tight tracking-tight text-[var(--color-foreground)] sm:text-[30px]",
              classNames?.title,
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            محصولات
          </h1>
          <p
            className={cn(
              "mt-3 text-[13px] font-normal text-[var(--color-muted)]",
              classNames?.count,
            )}
          >
            {products.length.toLocaleString("fa-IR")} مورد
          </p>
        </div>

        {products.length === 0 ? (
          <p
            className={cn(
              "border border-dashed border-[var(--color-muted)]/25 py-16 text-center text-[13px] text-[var(--color-muted)]",
              classNames?.empty,
            )}
          >
            هنوز محصولی ثبت نشده است.
          </p>
        ) : layout === "list" ? (
          <div className={cn("divide-y divide-[var(--color-muted)]/10", classNames?.grid)}>
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
                stock={product.stock}
                imageClassName={classNames?.image}
              />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4",
              classNames?.grid,
            )}
          >
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
                imageClassName={classNames?.image}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
