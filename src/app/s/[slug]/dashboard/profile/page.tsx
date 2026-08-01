"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Profile = {
  name: string | null;
  phone: string | null;
  address: string | null;
  accountPhone?: string | null;
};

export default function BuyerProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Profile>({
    queryKey: ["store-me", slug],
    queryFn: async () => {
      const res = await fetch(`/api/s/${slug}/me`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!data) return;
    setName(data.name ?? "");
    setPhone(data.phone ?? data.accountPhone ?? "");
    setAddress(data.address ?? "");
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/s/${slug}/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("پروفایل این فروشگاه ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["store-me", slug] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return <p className="text-[var(--color-muted)]">در حال بارگذاری...</p>;
  }

  return (
    <form
      className="max-w-lg space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <p className="text-sm text-[var(--color-muted)]">
        این اطلاعات فقط برای «همین فروشگاه» ذخیره می‌شود.
        {data?.accountPhone ? (
          <>
            {" "}
            شماره حساب: <span dir="ltr">{data.accountPhone}</span>
          </>
        ) : null}
      </p>

      <div className="space-y-2">
        <Label htmlFor="name">نام تحویل‌گیرنده</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">شماره تماس</Label>
        <PhoneInput id="phone" value={phone} onChange={setPhone} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">آدرس</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={4}
        />
      </div>
      <Button type="submit" className="rounded-full" disabled={save.isPending}>
        {save.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
