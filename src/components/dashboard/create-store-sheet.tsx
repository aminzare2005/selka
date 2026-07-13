"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/ui/form-sheet";
import { StoreForm } from "@/components/dashboard/new-store-form";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type CreateStoreSheetProps = {
  triggerLabel?: string;
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
};

export function CreateStoreSheet({
  triggerLabel = "ساخت فروشگاه",
  buttonSize,
  buttonVariant,
}: CreateStoreSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={buttonVariant} size={buttonSize} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="فروشگاه جدید"
        description="نام و آدرس فروشگاه خود را وارد کنید"
      >
        <StoreForm
          onSuccess={() => {
            setOpen(false);
            router.push("/dashboard");
            router.refresh();
          }}
        />
      </FormSheet>
    </>
  );
}
