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
import { EmptyState } from "@/components/ui/empty-state";
import { FormSheet } from "@/components/ui/form-sheet";
import { ProductForm } from "@/components/dashboard/product-form";
import { ProductListSkeleton } from "@/components/ui/dashboard-skeletons";
import { cn, formatPrice } from "@/lib/utils";
import { productPath } from "@/lib/storefront-url";
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
      const res = await fetch(`/api/stores/${storeId}/products/${product.id}`, {
        method: "DELETE",
      });
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
      <Card className="group overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-secondary/60">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
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
            {isLowStock && !isOutOfStock && (
              <Badge variant="warning">موجودی کم</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-bold leading-snug">
            {product.title}
          </h3>

          <div className="mt-2">
            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            <p
              className={cn(
                "text-xs",
                isOutOfStock
                  ? "text-coral-600"
                  : isLowStock
                    ? "text-sun-600"
                    : "text-muted-foreground",
              )}
            >
              موجودی: {product.stock.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-divider pt-4">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(product)}
              aria-label="ویرایش"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {storeSlug && product.isActive && (
              <Button
                variant="outline"
                size="icon-sm"
                asChild
                aria-label="مشاهده"
              >
                <a
                  href={productPath(storeSlug, product.slug)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDeleteOpen(true)}
              aria-label="حذف"
              className="text-coral-600 hover:border-coral-100 hover:bg-coral-100 hover:text-coral-800"
            >
              <Trash2 className="h-4 w-4" />
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
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteProduct.isPending}
            >
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
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 5,
  ).length;

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
              <span className="flex items-center gap-1 text-sun-600">
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
          editingProduct
            ? "اطلاعات محصول را ویرایش کنید"
            : "اطلاعات محصول را وارد کنید"
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
        <EmptyState
          icon={<Package />}
          title="قفسه‌ها هنوز خالی‌اند"
          description="اولین محصولت رو اضافه کن تا فروشگاه راه بیفتد. کمتر از یک دقیقه طول می‌کشد."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              افزودن اولین محصول
            </Button>
          }
        />
      ) : (
        <div className="stagger grid gap-4 grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeId={storeId}
              storeSlug={storeSlug}
              onEdit={openEdit}
              onDeleted={() =>
                queryClient.invalidateQueries({
                  queryKey: ["products", storeId],
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
