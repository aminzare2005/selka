/** Public storefront URL prefix — e.g. /@demo-shop */
export function storePath(slug: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/@${slug}${normalized}`;
}

export function productPath(storeSlug: string, productSlug: string): string {
  return storePath(storeSlug, `/products/${productSlug}`);
}

export function storePrefix(): string {
  return "/@";
}
