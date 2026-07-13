"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type GatewayData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

type GatewayFormProps = {
  storeId: string;
  gateway: GatewayData;
  onSuccess?: () => void;
};

export function GatewayForm({ storeId, gateway, onSuccess }: GatewayFormProps) {
  const queryClient = useQueryClient();
  const [merchantId, setMerchantId] = useState("");
  const [isEnabled, setIsEnabled] = useState(gateway.isEnabled);

  const saveGateway = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${storeId}/gateways`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gatewayId: gateway.id,
          isEnabled,
          merchantId: merchantId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success(isEnabled ? "درگاه فعال شد" : "درگاه غیرفعال شد");
      queryClient.invalidateQueries({ queryKey: ["gateways", storeId] });
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const needsMerchantId = isEnabled && !gateway.hasCredentials && !merchantId.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveGateway.mutate();
      }}
      className="space-y-6"
    >
      <div className="rounded-xl bg-secondary/60 p-4">
        <p className="font-medium">{gateway.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{gateway.description}</p>
        <p className="mt-2 text-caption" dir="ltr">
          {gateway.slug}
        </p>
      </div>

      <div className="space-y-3">
        <Label>وضعیت درگاه</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: true, label: "فعال", hint: "پرداخت از این درگاه فعال می‌شود" },
            { value: false, label: "غیرفعال", hint: "درگاه برای مشتریان نمایش داده نمی‌شود" },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => setIsEnabled(option.value)}
              className={cn(
                "rounded-xl border p-3 text-start transition-colors",
                isEnabled === option.value
                  ? "border-foreground bg-secondary/50"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <p className="font-medium">{option.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{option.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-2">
          <Label htmlFor="merchantId">شناسه پذیرنده (Merchant ID)</Label>
          <Input
            id="merchantId"
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)}
            placeholder={gateway.hasCredentials ? "برای تغییر، شناسه جدید وارد کنید" : "شناسه زیبال"}
            dir="ltr"
          />
          {gateway.hasCredentials && !merchantId && (
            <p className="text-xs text-muted-foreground">شناسه قبلی ثبت شده است.</p>
          )}
        </div>
      )}

      {!isEnabled && gateway.isEnabled && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          با غیرفعال کردن، مشتریان دیگر نمی‌توانند از این درگاه پرداخت کنند.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={saveGateway.isPending || needsMerchantId}>
        {saveGateway.isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </Button>
    </form>
  );
}
