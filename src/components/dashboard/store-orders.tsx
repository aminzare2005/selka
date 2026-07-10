"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  items: Array<{ title: string; quantity: number; price: number }>;
};

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  PAID: { label: "پرداخت شده", variant: "success" },
  PENDING: { label: "در انتظار", variant: "warning" },
  FAILED: { label: "ناموفق", variant: "destructive" },
  CANCELLED: { label: "لغو شده", variant: "secondary" },
};

export function StoreOrders({ storeId }: { storeId: string }) {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/orders`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  if (isLoading) return <p>در حال بارگذاری...</p>;

  if (orders.length === 0) {
    return <p className="text-muted-foreground">هنوز سفارشی ثبت نشده</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const status = statusLabels[order.status] ?? { label: order.status, variant: "secondary" as const };
        return (
          <div key={order.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              </div>
              <div className="text-left">
                <Badge variant={status.variant}>{status.label}</Badge>
                <p className="mt-1 text-sm font-medium">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{formatDate(order.createdAt)}</div>
            <ul className="mt-2 text-sm">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
