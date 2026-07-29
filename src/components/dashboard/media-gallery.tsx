"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import type { MediaItem } from "@/components/dashboard/media-uploader";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

function MediaCard({
  item,
  onDelete,
}: {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-square bg-secondary/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.filename}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-medium" title={item.filename}>
          {item.filename}
        </p>
        <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
        aria-label="حذف"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MediaGallery() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  const { data: media = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      const res = await fetch("/api/media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("تصویر آپلود شد");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setDeleteTarget(null);
      toast.success("تصویر حذف شد");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: فقط تصویر مجاز است`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: حداکثر حجم ۵ مگابایت`);
          continue;
        }
        upload.mutate(file);
      }
    },
    [upload],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-colors",
          dragOver
            ? "border-brand-400 bg-brand-50"
            : "border-border bg-secondary/20",
          upload.isPending && "pointer-events-none opacity-60",
        )}
      >
        {upload.isPending ? (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
            <Upload className="h-7 w-7" />
          </div>
        )}
        <div className="text-center">
          <p className="font-bold">
            {upload.isPending ? "در حال آپلود..." : "تصاویر را اینجا رها کنید"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG، JPG یا WebP — حداکثر ۵ مگابایت — چند فایل همزمان
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          <Upload className="h-4 w-4" />
          انتخاب فایل
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {isLoading ? (
        <GallerySkeleton />
      ) : media.length === 0 ? (
        <EmptyState
          icon={<ImageIcon />}
          tone="ocean"
          title="گالری هنوز خالیه"
          description="هر تصویری که آپلود کنی اینجا می‌ماند تا بعداً برای محصول‌ها و صفحه اصلی استفاده‌اش کنی."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {media.length.toLocaleString("fa-IR")} تصویر
          </p>
          <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {media.map((item) => (
              <MediaCard key={item.id} item={item} onDelete={setDeleteTarget} />
            ))}
          </div>
        </>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>حذف تصویر</DialogTitle>
            <DialogDescription>
              آیا مطمئنید که می‌خواهید «{deleteTarget?.filename}» را حذف کنید؟
              این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-2xl border border-sun-100 bg-sun-100/60 p-3 text-sm text-sun-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              اگر این تصویر در محصولات یا تنظیمات فروشگاه استفاده شده باشد،
              لینک آن دیگر کار نخواهد کرد.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMedia.isPending}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMedia.mutate(deleteTarget.id)}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال حذف...
                </>
              ) : (
                "حذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
