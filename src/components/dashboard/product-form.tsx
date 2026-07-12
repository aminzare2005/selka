"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import slugify from "slugify";

type ProductFormProps = {
  storeId: string;
  onSuccess?: () => void;
};

export function ProductForm({ storeId, onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const createProduct = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          price: parseInt(price, 10),
          stock: parseInt(stock, 10),
          description,
          images: imageUrl ? [imageUrl] : [],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("محصول اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
      setTitle("");
      setSlug("");
      setPrice("");
      setStock("0");
      setDescription("");
      setImageUrl("");
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `stores/${storeId}`);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error);
      return;
    }
    setImageUrl(json.url);
    toast.success("تصویر آپلود شد");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>عنوان</Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value, { lower: true, strict: true, locale: "fa" }));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>آدرس (slug)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>قیمت (تومان)</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>موجودی</Label>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} type="number" dir="ltr" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>تصویر</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="preview" className="mt-2 h-20 w-20 rounded object-cover" />
        )}
      </div>
      <Button onClick={() => createProduct.mutate()} disabled={createProduct.isPending} className="w-full">
        {createProduct.isPending ? "در حال ذخیره..." : "ذخیره محصول"}
      </Button>
    </div>
  );
}
