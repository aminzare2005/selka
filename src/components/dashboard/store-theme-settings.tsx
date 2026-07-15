"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, LayoutTemplate, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MediaUploader } from "@/components/dashboard/media-uploader";

const THEME_APPLY_DELAY_MS = 5000;

type Store = {
  id: string;
  slug: string;
  themeId: string;
  settings: Record<string, unknown>;
};

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  previewColor: string;
};

function ThemeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border p-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function StoreThemeSettings({ store }: { store: Store }) {
  const queryClient = useQueryClient();
  const settings = (store.settings ?? {}) as Record<string, unknown>;
  const tokens = (settings.tokens ?? {}) as Record<string, unknown>;
  const colors = (tokens.colors ?? {}) as Record<string, string>;

  const [appliedThemeId, setAppliedThemeId] = useState(store.themeId);
  const [selectedThemeId, setSelectedThemeId] = useState(store.themeId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [primary, setPrimary] = useState(colors.primary ?? "#0a0a0a");
  const [heroTitle, setHeroTitle] = useState((settings.heroTitle as string) ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState((settings.heroSubtitle as string) ?? "");
  const [logo, setLogo] = useState((settings.logo as string) ?? "");
  const [heroImage, setHeroImage] = useState((settings.heroImage as string) ?? "");

  const { data: themes = [], isLoading: themesLoading } = useQuery<ThemeOption[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await fetch("/api/themes");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const saveAppearance = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: appliedThemeId,
          settings: {
            tokens: { colors: { primary } },
            heroTitle: heroTitle || undefined,
            heroSubtitle: heroSubtitle || undefined,
            logo: logo || undefined,
            heroImage: heroImage || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("تنظیمات ظاهری ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["store", store.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const applyTheme = useMutation({
    mutationFn: async (newThemeId: string) => {
      const [result] = await Promise.all([
        fetch(`/api/stores/${store.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeId: newThemeId }),
        }).then(async (res) => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.error);
          return json;
        }),
        delay(THEME_APPLY_DELAY_MS),
      ]);
      return result;
    },
    onSuccess: (_data, newThemeId) => {
      setAppliedThemeId(newThemeId);
      setSelectedThemeId(newThemeId);
      setConfirmOpen(false);
      toast.success("تم فروشگاه با موفقیت اعمال شد");
      queryClient.invalidateQueries({ queryKey: ["store", store.id] });
    },
    onError: (err: Error) => {
      setConfirmOpen(false);
      toast.error(err.message);
    },
  });

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);
  const hasThemeChange = selectedThemeId !== appliedThemeId;

  function handleApplyThemeClick() {
    if (!hasThemeChange) return;
    setConfirmOpen(true);
  }

  function handleConfirmApply() {
    applyTheme.mutate(selectedThemeId);
  }

  if (themesLoading) {
    return (
      <div className="space-y-8">
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <ThemeGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold">تنظیمات ظاهری</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            رنگ و متن‌های صفحه اصلی فروشگاه را شخصی‌سازی کنید.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary">رنگ اصلی</Label>
          <div className="flex items-center gap-3">
            <Input
              id="primary"
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="h-11 w-14 rounded-xl p-1"
            />
            <Input value={primary} onChange={(e) => setPrimary(e.target.value)} dir="ltr" className="text-end" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroTitle">عنوان صفحه اصلی</Label>
          <Input id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">زیرعنوان</Label>
          <Input id="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
        </div>

        <MediaUploader
          label="لوگوی فروشگاه"
          value={logo}
          onChange={setLogo}
          folder={`stores/${store.id}/branding`}
        />

        <MediaUploader
          label="تصویر پس‌زمینه صفحه اصلی"
          value={heroImage}
          onChange={setHeroImage}
          folder={`stores/${store.id}/branding`}
        />

        <Button
          onClick={() => saveAppearance.mutate()}
          disabled={saveAppearance.isPending}
          variant="outline"
          className="rounded-full"
        >
          {saveAppearance.isPending ? "در حال ذخیره..." : "ذخیره تنظیمات ظاهری"}
        </Button>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">انتخاب تم</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              تغییر تم، ساختار و چیدمان کلی فروشگاه را عوض می‌کند. این کار زمان‌بر است و
              توصیه می‌شود فقط در صورت نیاز واقعی انجام شود.
            </p>
          </div>
          {hasThemeChange && (
            <Button
              onClick={handleApplyThemeClick}
              disabled={applyTheme.isPending}
              className="shrink-0 rounded-full"
            >
              {applyTheme.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال اعمال تم...
                </>
              ) : (
                "اعمال تم انتخاب‌شده"
              )}
            </Button>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            تم فعلی: <span className="font-medium">{themes.find((t) => t.id === appliedThemeId)?.name}</span>.
            {" "}برای تعویض تم، یکی از گزینه‌های زیر را انتخاب و سپس تأیید کنید.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {themes.map((theme) => {
            const isApplied = theme.id === appliedThemeId;
            const isSelected = theme.id === selectedThemeId;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedThemeId(theme.id)}
                disabled={applyTheme.isPending}
                className={cn(
                  "group rounded-xl border bg-card p-3 text-start transition-all",
                  isSelected
                    ? "border-foreground ring-2 ring-foreground/20"
                    : "border-border hover:border-foreground/30 hover:shadow-sm",
                  applyTheme.isPending && "pointer-events-none opacity-60",
                )}
              >
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.previewColor}22 0%, ${theme.previewColor}55 100%)`,
                  }}
                >
                  <LayoutTemplate
                    className="h-10 w-10 transition-transform group-hover:scale-105"
                    style={{ color: theme.previewColor }}
                  />
                  {isApplied && (
                    <Badge variant="success" className="absolute top-2 start-2">
                      <Check className="h-3 w-3" />
                      فعال
                    </Badge>
                  )}
                </div>
                <p className="mt-3 font-medium">{theme.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأیید تغییر تم</DialogTitle>
            <DialogDescription>
              آیا مطمئنید که می‌خواهید تم فروشگاه را به «{selectedTheme?.name}» تغییر دهید؟
              این تغییر ظاهر و ساختار کلی فروشگاه را عوض می‌کند و چند لحظه زمان می‌برد.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={applyTheme.isPending}
            >
              انصراف
            </Button>
            <Button onClick={handleConfirmApply} disabled={applyTheme.isPending}>
              {applyTheme.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال اعمال...
                </>
              ) : (
                "بله، اعمال شود"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
