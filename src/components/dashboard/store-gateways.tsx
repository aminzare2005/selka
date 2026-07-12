"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GatewayListSkeleton } from "@/components/ui/dashboard-skeletons";
import { toast } from "sonner";

type Gateway = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

export function StoreGateways({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();
  const [merchantId, setMerchantId] = useState("");

  const { data: gateways = [], isLoading } = useQuery<Gateway[]>({
    queryKey: ["gateways", storeId],
    queryFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/gateways`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const updateGateway = useMutation({
    mutationFn: async (data: { gatewayId: string; isEnabled: boolean; merchantId?: string }) => {
      const res = await fetch(`/api/stores/${storeId}/gateways`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("تنظیمات درگاه ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["gateways", storeId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <GatewayListSkeleton />;

  if (gateways.length === 0) {
    return <p className="text-muted-foreground">درگاه پرداختی در پلتفرم فعال نیست. با ادمین تماس بگیرید.</p>;
  }

  return (
    <div className="space-y-4">
      {gateways.map((gateway) => (
        <div key={gateway.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{gateway.name}</p>
              <p className="text-sm text-muted-foreground">{gateway.description}</p>
            </div>
            <Badge variant={gateway.isEnabled ? "success" : "secondary"}>
              {gateway.isEnabled ? "فعال" : "غیرفعال"}
            </Badge>
          </div>
          <div className="mt-4 space-y-2">
            <Label>شناسه پذیرنده (Merchant ID)</Label>
            <Input
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="شناسه زیبال"
              dir="ltr"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() =>
                updateGateway.mutate({
                  gatewayId: gateway.id,
                  isEnabled: true,
                  merchantId,
                })
              }
              disabled={updateGateway.isPending || !merchantId}
            >
              فعال‌سازی
            </Button>
            {gateway.isEnabled && (
              <Button
                variant="outline"
                onClick={() =>
                  updateGateway.mutate({
                    gatewayId: gateway.id,
                    isEnabled: false,
                  })
                }
                disabled={updateGateway.isPending}
              >
                غیرفعال‌سازی
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
