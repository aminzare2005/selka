"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

type Gateway = { slug: string; name: string };
type CartData = { items: unknown[]; total: number };

export function useCheckout(storeSlug: string) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gatewaySlug, setGatewaySlug] = useState("");

  const { data: cart } = useQuery<CartData>({
    queryKey: ["cart", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/cart`);
      return res.json();
    },
  });

  const { data: gateways = [] } = useQuery<Gateway[]>({
    queryKey: ["store-gateways", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/gateways`);
      return res.json();
    },
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          gatewaySlug: gatewaySlug || gateways[0]?.slug,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: (data) => {
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    },
  });

  return {
    cart,
    gateways,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    gatewaySlug: gatewaySlug || gateways[0]?.slug,
    setGatewaySlug,
    checkout,
  };
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export { formatPrice };
