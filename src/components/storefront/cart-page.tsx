"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/storefront/price-display";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { productPath, storePath } from "@/lib/storefront-url";
import { toast } from "sonner";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
  };
};

type CartData = {
  items: CartItem[];
  total: number;
  itemCount: number;
};

export function CartPage({ storeSlug }: { storeSlug: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<CartData>({
    queryKey: ["cart", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/cart`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await fetch(`/api/s/${storeSlug}/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", storeSlug] }),
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-h2" style={{ fontFamily: "var(--font-display)" }}>سبد خرید</h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-[var(--color-muted)]">سبد خرید خالی است</p>
          <Button className="mt-6 rounded-full" asChild>
            <Link href={storePath(storeSlug)}>بازگشت به فروشگاه</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-[var(--color-muted)]/10 p-4 transition-all duration-200"
              >
                {item.product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={productPath(storeSlug, item.product.slug)}
                    className="font-medium hover:text-[var(--color-primary)] transition-colors truncate block"
                  >
                    {item.product.title}
                  </Link>
                  <PriceDisplay amount={item.product.price} size="sm" className="mt-1" />
                </div>
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => updateItem.mutate({ itemId: item.id, quantity: q })}
                />
                <button
                  onClick={() => updateItem.mutate({ itemId: item.id, quantity: 0 })}
                  className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--color-muted)]/10 p-6">
              <p className="text-sm text-[var(--color-muted)]">جمع کل</p>
              <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(data?.total ?? 0)}
              </p>
              <Button
                className="mt-6 w-full bg-[var(--color-primary)] text-white hover:opacity-90 rounded-full"
                size="lg"
                asChild
              >
                <Link href={storePath(storeSlug, "/checkout")}>ادامه خرید</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
