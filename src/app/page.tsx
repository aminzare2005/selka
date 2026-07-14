import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Section, SectionHeader } from "@/components/layout/section";
import { Palette, BarChart3, CreditCard, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

export default async function HomePage() {
  const storeCount = await db.store.count().catch(() => 0);

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <Section className="pb-16 pt-20 md:pt-28">
          <div className="mx-auto max-w-4xl px-6 text-center animate-slide-up">
            <p className="mb-4 text-caption font-medium uppercase tracking-widest">
              پلتفرم فروشگاه‌ساز
            </p>
            <h1 className="text-display text-foreground">
              فروشگاهت را بساز.
              <br />
              بفروش.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              در چند دقیقه فروشگاه آنلاین فارسی بساز، تم انتخاب کن، محصول اضافه
              کن و بفروش.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">
                  شروع رایگان
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">ورود به پنل</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* Social proof */}
        {storeCount > 0 && (
          <div className="border-y border-border bg-secondary/30 py-6">
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {storeCount.toLocaleString("fa-IR")}
              </span>{" "}
              فروشگاه روی مارتی ساخته شده
            </p>
          </div>
        )}

        {/* Features bento */}
        <Section>
          <SectionHeader
            title="همه‌چیز برای فروش آنلاین"
            description="از ساخت فروشگاه تا دریافت پرداخت، همه در یک پلتفرم"
          />
          <div className="mx-auto grid max-w-5xl gap-4 px-6 md:grid-cols-3">
            {[
              {
                icon: Palette,
                title: "تم‌های حرفه‌ای",
                desc: "از بین تم‌های آماده انتخاب کن و رنگ و فونت را شخصی‌سازی کن.",
                className: "md:col-span-2",
              },
              {
                icon: BarChart3,
                title: "مدیریت آسان",
                desc: "محصولات، سفارش‌ها و موجودی را از یک پنل مدیریت کن.",
                className: "",
              },
              {
                icon: CreditCard,
                title: "پرداخت امن",
                desc: "درگاه زیبال و سایر درگاه‌ها با چند کلیک فعال می‌شوند.",
                className: "md:col-span-3 md:max-w-md md:mx-auto",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${item.className}`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* How it works */}
        <Section className="bg-secondary/20">
          <SectionHeader title="چطور کار می‌کند؟" />
          <div className="mx-auto grid max-w-4xl gap-8 px-6 md:grid-cols-3">
            {[
              { step: "۰۱", title: "ثبت‌نام", desc: "حساب کاربری بساز" },
              { step: "۰۲", title: "فروشگاه", desc: "فروشگاه و تم انتخاب کن" },
              { step: "۰۳", title: "فروش", desc: "محصول اضافه کن و بفروش" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <p className="font-display text-5xl font-bold text-border">
                  {item.step}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Final CTA */}
        <Section className="pb-32">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16">
              <h2 className="text-h2 text-white">آماده‌ای شروع کنی؟</h2>
              <p className="mx-auto mt-3 max-w-md text-white/70">
                همین الان فروشگاه آنلاین خودت را بساز. رایگان شروع کن.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="mt-8 border-white/20 bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/register">ساخت فروشگاه</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <MarketingFooter />
    </div>
  );
}
