"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, Trash2, Upload, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MediaPickerDialog } from "@/components/dashboard/media-picker-dialog";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

type MediaUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
};

export function MediaUploader({
  value,
  onChange,
  folder = "general",
  label = "تصویر",
  className,
}: MediaUploaderProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json as MediaItem;
    },
    onSuccess: (media) => {
      onChange(media.url);
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("تصویر آپلود شد");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("فقط تصویر مجاز است");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حداکثر حجم ۵ مگابایت");
        return;
      }
      upload.mutate(file);
    },
    [upload],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  if (value) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <p className="text-sm font-medium">{label}</p>}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
            >
              {upload.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              تعویض
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setPickerOpen(true)}
            >
              <Images className="h-4 w-4" />
              گالری
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange("")}
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <MediaPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={(url) => {
            onChange(url);
            setPickerOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          dragOver
            ? "border-brand-400 bg-brand-50"
            : "border-border bg-secondary/20 hover:border-brand-300 hover:bg-brand-50/60",
          upload.isPending && "pointer-events-none opacity-60",
        )}
      >
        {upload.isPending ? (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="text-center">
          <p className="text-sm font-semibold">
            {upload.isPending ? "در حال آپلود..." : "تصویر را اینجا رها کنید"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG، JPG یا WebP — حداکثر ۵ مگابایت
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="rounded-full"
          >
            <Upload className="h-4 w-4" />
            انتخاب فایل
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
            disabled={upload.isPending}
            className="rounded-full"
          >
            <Images className="h-4 w-4" />
            انتخاب از گالری
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
