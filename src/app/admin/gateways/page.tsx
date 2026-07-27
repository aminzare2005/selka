import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { adminNavItems } from "@/components/layout/dashboard-nav";
import { PageHeader } from "@/components/ui/page-header";

export default async function AdminGatewaysPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== "PLATFORM_ADMIN") redirect("/dashboard");

  const gateways = await db.paymentGateway.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell
      user={session.user}
      sections={[{ items: adminNavItems }]}
      brand="سلکا ادمین"
      brandHref="/admin"
    >
      <PageHeader
        title="درگاه‌های پرداخت"
        description="مدیریت درگاه‌های فعال پلتفرم"
      />

      <div className="mt-8 space-y-3">
        {gateways.map((g) => (
          <div
            key={g.id}
            className="flex items-center justify-between rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-sm"
          >
            <div>
              <p className="font-semibold">{g.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {g.description}
              </p>
              <p className="mt-1 text-caption" dir="ltr">
                {g.slug}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${g.isActive ? "bg-emerald-50 text-emerald-700" : "bg-secondary text-muted-foreground"}`}
            >
              {g.isActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
