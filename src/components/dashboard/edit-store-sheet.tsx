"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/ui/form-sheet";
import { StoreForm } from "@/components/dashboard/new-store-form";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type EditStoreSheetProps = {
  store: { id: string; name: string; slug: string };
  triggerLabel?: string;
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
};

export function EditStoreSheet({
  store,
  triggerLabel = "ویرایش",
  buttonSize = "sm",
  buttonVariant = "outline",
}: EditStoreSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={buttonVariant} size={buttonSize} onClick={() => setOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
        {triggerLabel}
      </Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="ویرایش فروشگاه"
        description="نام و آدرس فروشگاه را ویرایش کنید"
      >
        {open && (
          <StoreForm
            key={store.id}
            store={store}
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        )}
      </FormSheet>
    </>
  );
}
