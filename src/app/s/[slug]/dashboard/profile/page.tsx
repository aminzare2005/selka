"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      toast.success("اطلاعات تحویل ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["store-me", slug] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return <p className="text-[13px] text-[var(--color-muted)]">در حال بارگذاری...</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <header>
        <h1
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          اطلاعات تحویل
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted)]">
          این مشخصات فقط برای همین فروشگاه ذخیره می‌شود و هنگام تسویه پیش‌پر می‌شود
          {data?.accountPhone ? (
            <>
              . شماره ورود حساب:{" "}
              <span dir="ltr" className="tabular-nums">
                {data.accountPhone}
              </span>
            </>
          ) : (
            "."
          )}
        </p>
      </header>

      <form
        className="space-y-5 rounded-2xl border border-[var(--color-muted)]/15 p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">نام تحویل‌گیرنده</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border-[var(--color-muted)]/25 bg-transparent hover:border-[var(--color-muted)]/40 focus-visible:border-[var(--color-foreground)] focus-visible:ring-[var(--color-foreground)]/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">شماره تماس</Label>
          <PhoneInput
            id="phone"
            value={phone}
            onChange={setPhone}
            required
            className="rounded-xl border-[var(--color-muted)]/25 bg-transparent hover:border-[var(--color-muted)]/40 focus-visible:border-[var(--color-foreground)] focus-visible:ring-[var(--color-foreground)]/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">آدرس</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={4}
            className="rounded-xl border-[var(--color-muted)]/25 bg-transparent hover:border-[var(--color-muted)]/40 focus-visible:border-[var(--color-foreground)] focus-visible:ring-[var(--color-foreground)]/10"
          />
        </div>
        <button
          type="submit"
          disabled={save.isPending}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 text-[13px] font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:min-w-40"
        >
          {save.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
