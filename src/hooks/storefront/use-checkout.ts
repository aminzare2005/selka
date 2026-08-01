"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Gateway = { slug: string; name: string };
type CartData = { items: unknown[]; total: number };
type Profile = { name: string | null; phone: string | null; address: string | null };

export function useCheckout(storeSlug: string) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gatewaySlug, setGatewaySlug] = useState("");
  const [prefilled, setPrefilled] = useState(false);

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

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["store-me", storeSlug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${storeSlug}/me`);
      if (res.status === 401) return null;
      const json = await res.json();
      if (!res.ok) return null;
      return json;
    },
    retry: false,
  });

  useEffect(() => {
    if (!profile || prefilled) return;
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
    if (profile.address) setAddress(profile.address);
    setPrefilled(true);
  }, [profile, prefilled]);

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
    onError: (err: Error) => toast.error(err.message),
  });

  const selectedGateway = gatewaySlug || gateways[0]?.slug;

  return {
    cart,
    gateways,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    gatewaySlug: selectedGateway,
    setGatewaySlug,
    checkout,
  };
}
