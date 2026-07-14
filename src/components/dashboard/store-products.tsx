"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ExternalLink,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormSheet } from "@/components/ui/form-sheet";
import { ProductForm } from "@/components/dashboard/product-form";
import { ProductListSkeleton } from "@/components/ui/dashboard-skeletons";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  images: string[];
};

function ProductCard({
  product,
  storeId,
  storeSlug,
  onEdit,
  onDeleted,
}: {
  product: Product;
  storeId: string;
  storeSlug?: string;
  onEdit: (product: Product) => void;
  onDeleted: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteProduct = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/products/${product.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("محصول حذف شد");
      setDeleteOpen(false);
      onDeleted();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3] bg-secondary/60">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
              <p className="mt-2 text-xs">بدون تصویر</p>
            </div>
          )}
          <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
            <Badge variant={product.isActive ? "success" : "secondary"}>
              {product.isActive ? "فعال" : "غیرفعال"}
            </Badge>
            {isOutOfStock && <Badge variant="destructive">ناموجود</Badge>}
            {isLowStock && !isOutOfStock && <Badge variant="warning">موجودی کم</Badge>}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-1">
            <h3 className="font-semibold leading-snug line-clamp-2">{product.title}</h3>
            <p className="w-fit text-caption" dir="ltr">
              /{product.slug}
            </p>
          </div>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              <p
                className={cn(
                  "text-xs",
                  isOutOfStock ? "text-destructive" : isLowStock ? "text-amber-700" : "text-muted-foreground",
                )}
              >
                موجودی: {product.stock.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="rounded-full">
              <Pencil className="h-3.5 w-3.5" />
              ویرایش
            </Button>
            {storeSlug && product.isActive && (
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <a href={`/s/${storeSlug}/products/${product.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  مشاهده
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full text-destructive hover:bg-red-50 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>حذف محصول</DialogTitle>
            <DialogDescription>
              آیا از حذف «{product.title}» مطمئنید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteProduct.isPending}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteProduct.mutate()}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "در حال حذف..." : "بله، حذف شود"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type StoreProductsProps = {
  storeId: string;
  storeSlug?: string;
};

export function StoreProducts({ storeId, storeSlug }: StoreProductsProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  function openCreate() {
    setEditingProduct(null);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setEditingProduct(null);
  }

  if (isLoading) return <ProductListSkeleton />;

  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={openCreate} className="rounded-full shrink-0">
          <Plus className="h-4 w-4" />
          افزودن محصول
        </Button>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{products.length.toLocaleString("fa-IR")} محصول</span>
          {activeCount > 0 && (
            <>
              <span>·</span>
              <span>{activeCount.toLocaleString("fa-IR")} فعال</span>
            </>
          )}
          {lowStockCount > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                {lowStockCount.toLocaleString("fa-IR")} با موجودی کم
              </span>
            </>
          )}
        </div>
      </div>

      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        title={editingProduct ? "ویرایش محصول" : "محصول جدید"}
        description={
          editingProduct ? "اطلاعات محصول را ویرایش کنید" : "اطلاعات محصول را وارد کنید"
        }
      >
        {open && (
          <ProductForm
            key={editingProduct?.id ?? "new"}
            storeId={storeId}
            product={editingProduct ?? undefined}
            onSuccess={() => handleOpenChange(false)}
          />
        )}
      </FormSheet>

      {products.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <Package className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-medium">هنوز محصولی ثبت نشده</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            اولین محصول فروشگاهت را اضافه کن و شروع به فروش کن.
          </p>
          <Button onClick={openCreate} className="mt-6 rounded-full">
            <Plus className="h-4 w-4" />
            افزودن اولین محصول
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeId={storeId}
              storeSlug={storeSlug}
              onEdit={openEdit}
              onDeleted={() => queryClient.invalidateQueries({ queryKey: ["products", storeId] })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
