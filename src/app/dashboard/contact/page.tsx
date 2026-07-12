import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { AppShell } from "@/components/layout/app-shell";
import { buildDashboardSections, dashboardNavItems } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AppShell user={session.user} sections={buildDashboardSections(dashboardNavItems)}>
      <PageHeader
        title="ارتباط با ما"
        description="تیم پشتیبانی تیکس آماده پاسخگویی است"
      />

      <div className="mt-8 max-w-lg space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <MessageCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">به زودی...</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                فرم تماس، تیکت پشتیبانی و چت آنلاین به‌زودی در این بخش فعال می‌شود.
                فعلاً می‌توانید از طریق ایمیل با ما در ارتباط باشید.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:support@tix.ir">
                <Mail className="h-4 w-4" />
                support@tix.ir
              </a>
            </Button>
          </CardContent>
        </Card>

        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4" />
            بازگشت به داشبورد
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
