"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, ImageIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/components/dashboard/media-uploader";

type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  selectedUrl?: string;
};

function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedUrl,
}: MediaPickerDialogProps) {
  const { data: media = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      const res = await fetch("/api/media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>انتخاب از گالری</DialogTitle>
          <DialogDescription>
            یکی از تصاویر آپلودشده را انتخاب کنید.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pe-1">
          {isLoading ? (
            <MediaGridSkeleton />
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                هنوز تصویری در گالری ندارید.
                <br />
                ابتدا یک تصویر آپلود کنید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {media.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.url)}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-transparent hover:border-foreground/30",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
