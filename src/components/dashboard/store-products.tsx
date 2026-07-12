"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormSheet } from "@/components/ui/form-sheet";
import { ProductForm } from "@/components/dashboard/product-form";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

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
  const [open, setOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
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

  if (isLoading) return <p>در حال بارگذاری...</p>;

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>افزودن محصول</Button>

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="محصول جدید"
        description="اطلاعات محصول را وارد کنید"
      >
        <ProductForm storeId={storeId} onSuccess={() => setOpen(false)} />
      </FormSheet>

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
