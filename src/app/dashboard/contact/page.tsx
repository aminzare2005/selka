import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { getSession } from "@/lib/auth-server";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <PageHeader
        icon={<MessageCircle />}
        title="ارتباط با ما"
        description="هر وقت گیر کردی، ما اینجاییم"
      />

      <div className="mt-8 max-w-lg space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">به‌زودی...</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                تیکت پشتیبانی و چت آنلاین دارند آماده می‌شوند. تا آن موقع یک
                ایمیل بزن، سریع جواب می‌دهیم.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:support@selka.ir">
                <Mail className="h-4 w-4" />
                support@selka.ir
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
    </div>
  );
}
