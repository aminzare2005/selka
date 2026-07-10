"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToCart(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await fetch(`/api/s/${storeSlug}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", storeSlug] });
    },
  });
}
