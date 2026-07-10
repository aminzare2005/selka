import type { Product } from "@/generated/prisma/client";
import type { StorefrontProduct } from "@/lib/themes/types";

export function toStorefrontProduct(product: Product): StorefrontProduct {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    images: product.images,
  };
}
