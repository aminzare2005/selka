"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { registerWithPhone, signInWithPhone } from "@/lib/auth-phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { storePath } from "@/lib/storefront-url";
import { toast } from "sonner";

type Mode = "login" | "register";

type StorefrontAuthFormProps = {
  mode: Mode;
  store: { name: string; slug: string };
  primaryColor?: string;
};

export function StorefrontAuthForm({ mode, store, primaryColor }: StorefrontAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCallback = storePath(store.slug, "/dashboard");
  const callbackUrl = searchParams.get("callbackUrl") ?? defaultCallback;
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (mode === "register") {
      const name = formData.get("name") as string;
      const { error } = await registerWithPhone({ name, phone, password });
      setLoading(false);
      if (error) {
        toast.error(error.message ?? "خطا در ثبت‌نام");
        return;
      }
      await fetch(`/api/s/${store.slug}/me`, { method: "POST" }).catch(() => undefined);
      toast.success("ثبت‌نام موفق!");
    } else {
      const { error } = await signInWithPhone(phone, password);
      setLoading(false);
      if (error) {
        toast.error(error.message ?? "خطا در ورود");
        return;
      }
      await fetch(`/api/s/${store.slug}/me`, { method: "POST" }).catch(() => undefined);
      await fetch(`/api/s/${store.slug}/cart`).catch(() => undefined);
      toast.success("خوش آمدید!");
    }

    router.push(callbackUrl);
    router.refresh();
  }

  const accent = primaryColor ?? "var(--color-primary)";

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Link
        href={storePath(store.slug)}
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        ← بازگشت به {store.name}
      </Link>
      <h1
        className="mt-6 text-3xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {mode === "login" ? "ورود" : "ثبت‌نام"}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {mode === "login"
          ? `وارد حسابت شو تا سفارش‌های «${store.name}» را ببینی`
          : `یک حساب بساز — در فروشگاه‌های دیگر سلکا هم قابل استفاده است`}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">نام</Label>
            <Input id="name" name="name" required placeholder="نام شما" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="phone">شماره موبایل</Label>
          <PhoneInput id="phone" name="phone" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" name="password" type="password" required minLength={6} dir="ltr" />
        </div>
        <Button
          type="submit"
          className="w-full rounded-full text-white"
          style={{ backgroundColor: accent }}
          size="lg"
          disabled={loading}
        >
          {loading
            ? mode === "login"
              ? "در حال ورود..."
              : "در حال ثبت‌نام..."
            : mode === "login"
              ? "ورود"
              : "ثبت‌نام"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        {mode === "login" ? (
          <>
            حساب نداری؟{" "}
            <Link
              href={`${storePath(store.slug, "/register")}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-medium text-[var(--color-foreground)] hover:underline"
            >
              ثبت‌نام
            </Link>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌ای؟{" "}
            <Link
              href={`${storePath(store.slug, "/login")}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-medium text-[var(--color-foreground)] hover:underline"
            >
              ورود
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
