import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toneSurface } from "@/components/ui/tone";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type DashboardStatsOverviewProps = {
  productCount: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenue: number;
};

const metricLinkClass =
  "group block transition-colors duration-200 hover:bg-secondary/40 active:bg-secondary/60 lg:hover:bg-secondary/30";

function MetricValue({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[1.65rem] lg:mt-1.5 lg:text-xl lg:font-bold lg:tracking-normal">
      {children}
    </p>
  );
}

function MetricLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium text-muted-foreground sm:text-sm lg:text-[0.8125rem] lg:font-normal">
      {children}
    </p>
  );
}

export function DashboardStatsOverview({
  productCount,
  paidOrders,
  pendingOrders,
  totalRevenue,
}: DashboardStatsOverviewProps) {
  return (
    <div className="stagger">
      <Card className="overflow-hidden p-0 shadow-[var(--shadow-card)]">
        <div className="lg:grid lg:grid-cols-[1.28fr_1fr]">
          <div
            className={cn(
              "relative border-b border-divider lg:border-b-0 lg:border-l",
              "bg-gradient-to-br from-ocean-100/75 via-card to-brand-50/25",
              "px-5 py-6 sm:px-6 sm:py-7 lg:px-10 lg:py-10 xl:px-11 xl:py-11",
              "before:pointer-events-none before:absolute before:inset-0",
              "before:bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_srgb,var(--ocean-100)_55%,transparent)_0%,transparent_58%)]",
              "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-white/70",
            )}
          >
            <div className="relative flex items-start justify-between gap-4 lg:gap-6">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ocean-800 lg:text-[0.9375rem]">
                  درآمد کل
                </p>
                <p
                  className={cn(
                    "mt-1.5 font-display tabular-nums text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl",
                    "lg:mt-2.5 lg:text-[2.75rem] lg:leading-[1.05] lg:tracking-[-0.03em]",
                    "xl:text-[3.25rem]",
                  )}
                >
                  {formatPrice(totalRevenue)}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm lg:mt-2 lg:text-[0.8125rem]">
                  جمع سفارش‌های پرداخت‌شده
                </p>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_0_rgb(255_255_255/0.55)]",
                  "lg:h-14 lg:w-14 lg:rounded-[1.125rem]",
                  toneSurface.ocean,
                )}
              >
                <TrendingUp className="h-5 w-5 lg:h-[1.375rem] lg:w-[1.375rem]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 auto-rows-fr lg:grid-cols-1 lg:divide-y lg:divide-divider">
            <Link
              href="/dashboard/products"
              className={cn(
                metricLinkClass,
                "row-span-2 flex flex-col justify-center gap-1 border-l border-divider p-5 sm:p-6",
                "lg:row-span-1 lg:border-l-0 lg:border-b lg:border-divider lg:px-8 lg:py-7",
              )}
            >
              <div className="flex items-center gap-2.5 lg:gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:h-8 lg:w-8",
                    toneSurface.brand,
                  )}
                >
                  <Package className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                </span>
                <MetricLabel>محصولات</MetricLabel>
              </div>
              <MetricValue>{productCount.toLocaleString("fa-IR")}</MetricValue>
            </Link>

            <Link
              href="/dashboard/orders"
              className={cn(
                metricLinkClass,
                "border-b border-divider p-4 sm:p-5 lg:border-b-0 lg:px-8 lg:py-6",
              )}
            >
              <div className="flex items-center gap-2.5 lg:gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    toneSurface.mint,
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </span>
                <MetricLabel>سفارش موفق</MetricLabel>
              </div>
              <MetricValue>{paidOrders.toLocaleString("fa-IR")}</MetricValue>
            </Link>

            <Link
              href="/dashboard/orders"
              className={cn(metricLinkClass, "p-4 sm:p-5 lg:px-8 lg:py-6")}
            >
              <div className="flex items-center gap-2.5 lg:gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    toneSurface.sun,
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                </span>
                <MetricLabel>در انتظار پرداخت</MetricLabel>
              </div>
              <MetricValue>{pendingOrders.toLocaleString("fa-IR")}</MetricValue>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
