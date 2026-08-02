import Link from "next/link";
import { SelkaBrandMark } from "@/components/layout/selka-brand-mark";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm animate-slide-up">
          <Link href="/">
            <SelkaBrandMark />
          </Link>
          <h1 className="mt-8 text-h2">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Visual side */}
      <div className="gradient-mesh relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="max-w-md px-12 text-center">
          <p className="font-display text-3xl font-bold leading-tight tracking-tight">
            فروشگاه آنلاین
            <br />
            در چند دقیقه
          </p>
          <p className="mt-4 text-muted-foreground">
            تم انتخاب کن، محصول اضافه کن، بفروش.
          </p>
        </div>
      </div>
    </div>
  );
}
