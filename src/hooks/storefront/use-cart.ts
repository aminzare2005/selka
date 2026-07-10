"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type CartItem = {
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

export type CartData = {
  items: CartItem[];
  total: number;
  itemCount: number;
};

export function useCart(storeSlug: string) {
  const queryClient = useQueryClient();

  const query = useQuery<CartData>({
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

  return { ...query, updateItem };
}
