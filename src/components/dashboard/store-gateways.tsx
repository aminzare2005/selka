"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Pencil, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSheet } from "@/components/ui/form-sheet";
import { GatewayForm } from "@/components/dashboard/gateway-form";
import { GatewayListSkeleton } from "@/components/ui/dashboard-skeletons";

type Gateway = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

function GatewayCard({
  gateway,
  onEdit,
}: {
  gateway: Gateway;
  onEdit: (gateway: Gateway) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">{gateway.name}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{gateway.description}</p>
              <p className="mt-1 text-caption" dir="ltr">
                {gateway.slug}
              </p>
            </div>
          </div>
          <Badge variant={gateway.isEnabled ? "success" : "secondary"}>
            {gateway.isEnabled ? "فعال" : "غیرفعال"}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {gateway.hasCredentials ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>شناسه پذیرنده ثبت شده</span>
              </>
            ) : (
              <span>شناسه پذیرنده تنظیم نشده</span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(gateway)} className="rounded-full">
            <Pencil className="h-3.5 w-3.5" />
            تنظیم درگاه
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StoreGateways({ storeId }: { storeId: string }) {
  const [open, setOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);

  const { data: gateways = [], isLoading } = useQuery<Gateway[]>({
    queryKey: ["gateways", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/gateways`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  function openEdit(gateway: Gateway) {
    setEditingGateway(gateway);
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setEditingGateway(null);
  }

  if (isLoading) return <GatewayListSkeleton />;

  if (gateways.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed py-16 text-center">
        <CreditCard className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 font-medium">درگاه پرداختی فعال نیست</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          درگاه پرداختی در پلتفرم فعال نیست. با ادمین تماس بگیرید.
        </p>
      </div>
    );
  }

  const activeCount = gateways.filter((g) => g.isEnabled).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{gateways.length.toLocaleString("fa-IR")} درگاه</span>
        {activeCount > 0 && (
          <>
            <span>·</span>
            <span>{activeCount.toLocaleString("fa-IR")} فعال</span>
          </>
        )}
      </div>

      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        title="تنظیم درگاه پرداخت"
        description={editingGateway ? `پیکربندی ${editingGateway.name}` : undefined}
      >
        {open && editingGateway && (
          <GatewayForm
            key={editingGateway.id}
            storeId={storeId}
            gateway={editingGateway}
            onSuccess={() => handleOpenChange(false)}
          />
        )}
      </FormSheet>

      <div className="grid gap-4 sm:grid-cols-2">
        {gateways.map((gateway) => (
          <GatewayCard key={gateway.id} gateway={gateway} onEdit={openEdit} />
        ))}
      </div>
    </div>
  );
}
