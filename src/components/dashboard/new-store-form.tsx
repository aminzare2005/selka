"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import slugify from "slugify";

type StoreFormProps = {
  store?: { id: string; name: string; slug: string };
  onSuccess?: (store: { id: string }) => void;
};

export function StoreForm({ store, onSuccess }: StoreFormProps) {
  const router = useRouter();
  const isEditing = !!store;
  const [name, setName] = useState(store?.name ?? "");
  const [slug, setSlug] = useState(store?.slug ?? "");

  const saveStore = useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const res = await fetch(isEditing ? `/api/stores/${store.id}` : "/api/stores", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "خطا");
      return json;
    },
    onSuccess: (savedStore) => {
      toast.success(isEditing ? "فروشگاه به‌روزرسانی شد" : "فروشگاه ساخته شد!");
      if (onSuccess) {
        onSuccess(savedStore);
      } else if (!isEditing) {
        router.push(`/dashboard/stores/${savedStore.id}`);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleNameChange(value: string) {
    setName(value);
    if (!isEditing) {
      setSlug(
        slugify(value, { lower: true, strict: true, locale: "fa" }) ||
          value.toLowerCase().replace(/\s+/g, "-"),
      );
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveStore.mutate({ name, slug });
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
      <Button type="submit" className="w-full" size="lg" disabled={saveStore.isPending}>
        {saveStore.isPending
          ? isEditing
            ? "در حال ذخیره..."
            : "در حال ساخت..."
          : isEditing
            ? "ذخیره تغییرات"
            : "ساخت فروشگاه"}
      </Button>
    </form>
  );
}

/** @deprecated Use StoreForm */
export const NewStoreForm = StoreForm;
