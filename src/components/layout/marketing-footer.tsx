import Link from "next/link";
import { SelkaBrandMark } from "@/components/layout/selka-brand-mark";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <SelkaBrandMark />
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              پلتفرم فروشگاه‌ساز فارسی برای ساخت، مدیریت و فروش آنلاین.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">محصول</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/register"
                  className="hover:text-foreground transition-colors"
                >
                  ساخت فروشگاه
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors"
                >
                  ورود
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">پشتیبانی</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span>مستندات</span>
              </li>
              <li>
                <span>تماس با ما</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-caption">
          © {new Date().getFullYear()} سلکا — تمامی حقوق محفوظ است
        </div>
      </div>
    </footer>
  );
}
