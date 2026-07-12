"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import slugify from "slugify";

export function NewStoreForm({ onSuccess }: { onSuccess?: (store: { id: string }) => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const createStore = useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "خطا");
      return json;
    },
    onSuccess: (store) => {
      toast.success("فروشگاه ساخته شد!");
      if (onSuccess) {
        onSuccess(store);
      } else {
        router.push(`/dashboard/stores/${store.id}`);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleNameChange(value: string) {
    setName(value);
    setSlug(
      slugify(value, { lower: true, strict: true, locale: "fa" }) ||
        value.toLowerCase().replace(/\s+/g, "-"),
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createStore.mutate({ name, slug });
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">نام فروشگاه</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          placeholder="فروشگاه من"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">آدرس فروشگاه</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/s/</span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            dir="ltr"
            pattern="[a-z0-9-]+"
            placeholder="my-shop"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={createStore.isPending}>
        {createStore.isPending ? "در حال ساخت..." : "ساخت فروشگاه"}
      </Button>
    </form>
  );
}
