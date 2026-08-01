"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Copy,
  MapPin,
  Package,
  Pencil,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toUiIranMobile } from "@/lib/phone";
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
import { OrderListSkeleton } from "@/components/ui/dashboard-skeletons";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  createdAt: string;
  items: OrderItem[];
};

type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "FAILED", "CANCELLED"];

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; description: string }
> = {
  PAID: { label: "پرداخت شده", variant: "success", description: "سفارش با موفقیت پرداخت شده" },
  PENDING: { label: "در انتظار", variant: "warning", description: "منتظر پرداخت مشتری" },
  FAILED: { label: "ناموفق", variant: "destructive", description: "پرداخت انجام نشده یا ناموفق بوده" },
  CANCELLED: { label: "لغو شده", variant: "secondary", description: "سفارش لغو شده است" },
};

function shortOrderId(id: string) {
  return id.slice(-8).toUpperCase();
}

function formatOrderForCopy(order: Order) {
  const status = statusConfig[order.status as OrderStatus]?.label ?? order.status;
  const itemsText = order.items
    .map((item) => `• ${item.title} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  return [
    "——— سفارش ———",
    `شماره: ${order.id}`,
    `وضعیت: ${status}`,
    `تاریخ: ${formatDate(order.createdAt)}`,
    "",
    "——— مشتری ———",
    `نام: ${order.customerName}`,
    `تلفن: ${toUiIranMobile(order.customerPhone)}`,
    `آدرس: ${order.customerAddress}`,
    "",
    "——— محصولات ———",
    itemsText,
    "",
    `جمع کل: ${formatPrice(order.totalAmount)}`,
  ].join("\n");
}

function OrderCard({
  order,
  storeId,
  onStatusUpdated,
}: {
  order: Order;
  storeId: string;
  onStatusUpdated: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status as OrderStatus);

  const status = statusConfig[order.status as OrderStatus] ?? {
    label: order.status,
    variant: "secondary" as const,
    description: "",
  };

  const updateStatus = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      const res = await fetch(`/api/stores/${storeId}/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("وضعیت سفارش به‌روزرسانی شد");
      setStatusDialogOpen(false);
      onStatusUpdated();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatOrderForCopy(order));
      setCopied(true);
      toast.success("اطلاعات سفارش کپی شد");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی انجام نشد");
    }
  }

  function openStatusDialog() {
    setSelectedStatus(order.status as OrderStatus);
    setStatusDialogOpen(true);
  }

  function handleSaveStatus() {
    if (selectedStatus === order.status) {
      setStatusDialogOpen(false);
      return;
    }
    updateStatus.mutate(selectedStatus);
  }

  const needsConfirm = selectedStatus === "CANCELLED" || selectedStatus === "FAILED";

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p className="text-xs text-muted-foreground">شماره سفارش</p>
              <p className="mt-0.5 w-fit font-mono text-sm font-medium" dir="ltr">
                #{shortOrderId(order.id)}
              </p>
            </div>
            <div className="text-end">
              <Badge variant={status.variant}>{status.label}</Badge>
              <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 text-sm">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">نام گیرنده</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">تلفن</p>
                  <p className="w-fit font-medium" dir="ltr">
                    {toUiIranMobile(order.customerPhone)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">آدرس</p>
                <p className="leading-relaxed">{order.customerAddress}</p>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/60 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                {order.items.length.toLocaleString("fa-IR")} قلم کالا
              </div>
              <ul className="space-y-1.5">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>
                      {item.title}{" "}
                      <span className="text-muted-foreground">× {item.quantity.toLocaleString("fa-IR")}</span>
                    </span>
                    <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">مبلغ کل</p>
              <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-mint-600" />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    کپی اطلاعات
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={openStatusDialog} className="rounded-full">
                <Pencil className="h-3.5 w-3.5" />
                ویرایش وضعیت
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ویرایش وضعیت سفارش</DialogTitle>
            <DialogDescription>
              سفارش #{shortOrderId(order.id)} — {order.customerName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-2">
            {ORDER_STATUSES.map((s) => {
              const config = statusConfig[s];
              const isSelected = selectedStatus === s;
              const isCurrent = order.status === s;

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStatus(s)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-start transition-colors duration-200",
                    isSelected
                      ? "border-brand-300 bg-brand-50"
                      : "border-border hover:border-brand-200 hover:bg-brand-50/50",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                      isSelected ? "border-brand-600 bg-brand-600" : "border-muted-foreground",
                    )}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{config.label}</span>
                      {isCurrent && (
                        <Badge variant="outline" className="text-[10px]">
                          فعلی
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {needsConfirm && selectedStatus !== order.status && (
            <p className="rounded-xl bg-sun-100 px-3 py-2 text-xs text-sun-800">
              این وضعیت معمولاً برای سفارش‌های لغو‌شده یا ناموفق استفاده می‌شود.
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} disabled={updateStatus.isPending}>
              انصراف
            </Button>
            <Button
              onClick={handleSaveStatus}
              disabled={updateStatus.isPending || selectedStatus === order.status}
            >
              {updateStatus.isPending ? "در حال ذخیره..." : "ذخیره وضعیت"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function StoreOrders({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/orders`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  if (isLoading) return <OrderListSkeleton />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag />}
        tone="mint"
        title="هنوز سفارشی نیامده"
        description="به محض اینکه اولین مشتری خرید کند، سفارشش را همین‌جا می‌بینی."
      />
    );
  }

  return (
    <div className="stagger space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          storeId={storeId}
          onStatusUpdated={() => queryClient.invalidateQueries({ queryKey: ["orders", storeId] })}
        />
      ))}
    </div>
  );
}
