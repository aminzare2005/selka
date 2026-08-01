"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { registerWithPhone } from "@/lib/auth-phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/auth-layout";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const { error } = await registerWithPhone({ name, phone, password });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "خطا در ثبت‌نام");
      return;
    }

    toast.success("ثبت‌نام موفق! خوش آمدید.");
    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
    router.refresh();
  }

  const isBuyerCallback = callbackUrl.startsWith("/@");

  return (
    <AuthLayout
      title="ثبت‌نام"
      subtitle={isBuyerCallback ? "حساب خریدار بساز" : "فروشگاه آنلاین خود را بسازید"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">نام</Label>
          <Input id="name" name="name" required placeholder="نام شما" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">شماره موبایل</Label>
          <PhoneInput id="phone" name="phone" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" name="password" type="password" required minLength={6} dir="ltr" />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          href={
            isBuyerCallback
              ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/login"
          }
          className="font-medium text-foreground hover:underline"
        >
          ورود
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
