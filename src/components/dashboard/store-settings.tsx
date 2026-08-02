"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Link2, Palette, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/components/dashboard/media-uploader";
import { storePath, storePrefix } from "@/lib/storefront-url";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type StoreSettingsProps = {
  store: {
    id: string;
    name: string;
    slug: string;
    settings: Record<string, unknown>;
  };
};

export function StoreSettings({ store }: StoreSettingsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const settings = (store.settings ?? {}) as Record<string, unknown>;
  const tokens = (settings.tokens ?? {}) as Record<string, unknown>;
  const colors = (tokens.colors ?? {}) as Record<string, string>;

  const [name, setName] = useState(store.name);
  const [slug, setSlug] = useState(store.slug);
  const [primary, setPrimary] = useState(colors.primary ?? "#0a0a0a");
  const [heroTitle, setHeroTitle] = useState((settings.heroTitle as string) ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState((settings.heroSubtitle as string) ?? "");
  const [aboutText, setAboutText] = useState((settings.aboutText as string) ?? "");
  const [logo, setLogo] = useState((settings.logo as string) ?? "");
  const [heroImage, setHeroImage] = useState((settings.heroImage as string) ?? "");

  const saveIdentity = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      toast.success("اطلاعات فروشگاه ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["store", store.id] });
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveAppearance = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            tokens: { colors: { primary } },
            heroTitle: heroTitle || undefined,
            heroSubtitle: heroSubtitle || undefined,
            aboutText,
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
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Identity */}
      <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-brand-600 shadow-[var(--shadow-xs)]">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-foreground">اطلاعات فروشگاه</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                اسم و آدرس عمومی فروشگاهت
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 rounded-full bg-card">
            <Link href={storePath(slug || store.slug)} target="_blank">
              مشاهده فروشگاه
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="space-y-5 rounded-t-3xl border-t border-brand-100 bg-card px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="store-name">نام فروشگاه</Label>
            <Input
              id="store-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="فروشگاه من"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-slug">آدرس فروشگاه</Label>
            <div
              className={cn(
                "flex items-stretch overflow-hidden rounded-xl border border-input bg-card",
                "transition-[border-color,box-shadow] duration-200",
                "hover:border-brand-300 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100",
              )}
              dir="ltr"
            >
              <span className="flex items-center gap-1.5 border-e border-input bg-secondary px-3 text-sm text-muted-foreground select-none">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                {storePrefix()}
              </span>
              <input
                id="store-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                pattern="[a-z0-9-]+"
                placeholder="my-shop"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {storePath(slug || "my-shop")}
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              onClick={() => saveIdentity.mutate()}
              disabled={saveIdentity.isPending}
              className="min-w-36 rounded-full"
            >
              {saveIdentity.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3 border-b border-divider px-5 py-4 sm:px-6">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ocean-100 text-ocean-600">
            <Palette className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-bold text-foreground">ظاهر فروشگاه</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              رنگ، متن‌ها، لوگو، تصویر صفحه اصلی و درباره ما
            </p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
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
              <Input
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                dir="ltr"
                className="text-end font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroTitle">عنوان صفحه اصلی</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="به فروشگاه ما خوش آمدید"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">توضیحات صفحه اصلی</Label>
            <Input
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="بهترین محصولات با بهترین قیمت"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutText">درباره فروشگاه</Label>
            <Textarea
              id="aboutText"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="داستان فروشگاهت را اینجا بنویس؛ این متن در صفحه درباره ما نمایش داده می‌شود."
              rows={6}
              className="min-h-32 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              در صفحه عمومی{" "}
              <span dir="ltr" className="font-mono">
                {storePath(slug || store.slug, "/about-us")}
              </span>{" "}
              دیده می‌شود.
            </p>
          </div>

          <MediaUploader
            label="لوگوی فروشگاه"
            value={logo}
            onChange={setLogo}
            folder={`stores/${store.id}/branding`}
          />

          <MediaUploader
            label="تصویر صفحه اصلی"
            value={heroImage}
            onChange={setHeroImage}
            folder={`stores/${store.id}/branding`}
          />

          <div className="flex justify-end border-t border-divider pt-5">
            <Button
              onClick={() => saveAppearance.mutate()}
              disabled={saveAppearance.isPending}
              className="min-w-36 rounded-full"
            >
              {saveAppearance.isPending ? "در حال ذخیره..." : "ذخیره ظاهر"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
