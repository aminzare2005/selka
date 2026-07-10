"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import slugify from "slugify";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  images: string[];
};

export function StoreProducts({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

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
      setShowForm(false);
      setTitle("");
      setSlug("");
      setPrice("");
      setStock("0");
      setDescription("");
      setImageUrl("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/stores/${storeId}/products/${productId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("محصول حذف شد");
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
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

  if (isLoading) return <p>در حال بارگذاری...</p>;

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "انصراف" : "افزودن محصول"}
      </Button>

      {showForm && (
        <div className="space-y-4 rounded-lg border p-4">
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
          <Button onClick={() => createProduct.mutate()} disabled={createProduct.isPending}>
            {createProduct.isPending ? "در حال ذخیره..." : "ذخیره محصول"}
          </Button>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-muted-foreground">هنوز محصولی ثبت نشده</p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.title} className="h-12 w-12 rounded object-cover" />
                )}
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(product.price)} — موجودی: {product.stock}
                  </p>
                </div>
                <Badge variant={product.isActive ? "success" : "secondary"}>
                  {product.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteProduct.mutate(product.id)}
                disabled={deleteProduct.isPending}
              >
                حذف
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
