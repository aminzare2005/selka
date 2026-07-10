import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { resolveStoreTheme } from "@/lib/themes/resolve";
import type { StoreSettings } from "@/lib/themes/types";

export async function getStoreBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return db.store.findUnique({
        where: { slug, status: "ACTIVE" },
        include: {
          products: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    },
    [`store-${slug}`],
    { tags: [`store:${slug}`], revalidate: 60 },
  )();
}

export async function getStoreTheme(slug: string) {
  const store = await getStoreBySlug(slug);
  if (!store) return null;

  const theme = await resolveStoreTheme(
    store.themeId,
    store.settings as StoreSettings,
  );

  return { store, theme };
}

export async function getProductBySlug(storeSlug: string, productSlug: string) {
  return unstable_cache(
    async () => {
      return db.product.findFirst({
        where: {
          slug: productSlug,
          isActive: true,
          store: { slug: storeSlug, status: "ACTIVE" },
        },
        include: { store: true },
      });
    },
    [`product-${storeSlug}-${productSlug}`],
    { tags: [`store:${storeSlug}`, `product:${storeSlug}:${productSlug}`], revalidate: 60 },
  )();
}
