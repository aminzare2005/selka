"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
};

export function StoreThemeSettings({ store }: { store: Store }) {
  const queryClient = useQueryClient();
  const settings = (store.settings ?? {}) as Record<string, unknown>;
  const tokens = (settings.tokens ?? {}) as Record<string, unknown>;
  const colors = (tokens.colors ?? {}) as Record<string, string>;

  const [themeId, setThemeId] = useState(store.themeId);
  const [primary, setPrimary] = useState(colors.primary ?? "#0a0a0a");
  const [heroTitle, setHeroTitle] = useState((settings.heroTitle as string) ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState((settings.heroSubtitle as string) ?? "");

  const { data: themes = [], isLoading: themesLoading } = useQuery<ThemeOption[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await fetch("/api/themes");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
  });

  const updateTheme = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId,
          settings: {
            tokens: { colors: { primary } },
            heroTitle: heroTitle || undefined,
            heroSubtitle: heroSubtitle || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("تنظیمات ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["store", store.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (themesLoading) {
    return (
      <div className="max-w-lg space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-3">
        <Label>تم</Label>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              type="button"
              variant={themeId === theme.id ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setThemeId(theme.id)}
              title={theme.description}
            >
              {theme.name}
            </Button>
          ))}
        </div>
        {themes.find((t) => t.id === themeId)?.description && (
          <p className="text-caption">
            {themes.find((t) => t.id === themeId)?.description}
          </p>
        )}
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
          <Input value={primary} onChange={(e) => setPrimary(e.target.value)} dir="ltr" />
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
      <Button onClick={() => updateTheme.mutate()} disabled={updateTheme.isPending} className="rounded-full">
        {updateTheme.isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </Button>
    </div>
  );
}
