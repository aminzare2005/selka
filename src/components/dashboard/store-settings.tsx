"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploader } from "@/components/dashboard/media-uploader";
import { storePath, storePrefix } from "@/lib/storefront-url";
import { toast } from "sonner";

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
    <div className="space-y-10">
      <section className="max-w-2xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">اطلاعات فروشگاه</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              نام و آدرس فروشگاه را مدیریت کنید.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 rounded-full">
            <Link href={storePath(slug || store.slug)} target="_blank">
              مشاهده فروشگاه
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{storePrefix()}</span>
            <Input
              id="store-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              dir="ltr"
              className="text-end"
              pattern="[a-z0-9-]+"
              placeholder="my-shop"
            />
          </div>
        </div>

        <Button
          onClick={() => saveIdentity.mutate()}
          disabled={saveIdentity.isPending}
          variant="outline"
          className="rounded-full"
        >
          {saveIdentity.isPending ? "در حال ذخیره..." : "ذخیره اطلاعات فروشگاه"}
        </Button>
      </section>

      <section className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold">ظاهر فروشگاه</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            رنگ، متن‌ها، لوگو و تصویر صفحه اصلی را شخصی‌سازی کنید.
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
            <Input
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              dir="ltr"
              className="text-end"
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

        <Button
          onClick={() => saveAppearance.mutate()}
          disabled={saveAppearance.isPending}
          variant="outline"
          className="rounded-full"
        >
          {saveAppearance.isPending ? "در حال ذخیره..." : "ذخیره تنظیمات ظاهری"}
        </Button>
      </section>
    </div>
  );
}
