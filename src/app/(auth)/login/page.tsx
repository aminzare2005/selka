"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { signInWithPhone } from "@/lib/auth-phone";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/auth-layout";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const { error } = await signInWithPhone(phone, password);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "خطا در ورود");
      return;
    }

    toast.success("خوش آمدید!");
    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout title="ورود" subtitle="شماره موبایل و رمز عبور خود را وارد کنید">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="phone">شماره موبایل</Label>
          <PhoneInput id="phone" name="phone" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" name="password" type="password" required dir="ltr" />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        حساب ندارید؟{" "}
        <Link
          href={
            callbackUrl.startsWith("/@")
              ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/register"
          }
          className="font-medium text-foreground hover:underline"
        >
          ثبت‌نام
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
