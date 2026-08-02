import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { DASHBOARD_MOBILE_TOOLBAR_HEIGHT } from "./dashboard-mobile-toolbar";
import type { NavSection } from "./dashboard-nav";

type AppShellProps = {
  children: React.ReactNode;
  user: { name: string; phoneNumber?: string | null; email?: string | null };
  sections: NavSection[];
  brand?: string;
  brandHref?: string;
  storeSlug?: string | null;
};

export function AppShell({
  children,
  user,
  sections,
  brand,
  brandHref,
  storeSlug,
}: AppShellProps) {
  const useMobileToolbar = Boolean(storeSlug);

  return (
    <div className="dashboard-shell relative min-h-screen bg-background">
      {/* Warm wash behind the top of every page, fading into the plain background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-brand-50 to-transparent"
      />
      <AppSidebar
        sections={sections}
        user={user}
        brand={brand}
        brandHref={brandHref}
        storeSlug={storeSlug}
      />
      <main className="relative lg:mr-64">
        <div
          className={cn(
            "min-h-screen px-5 pt-24 sm:px-8 lg:pt-10 lg:pb-16",
            useMobileToolbar
              ? "pb-[calc(1.5rem+var(--dashboard-mobile-toolbar-height)+env(safe-area-inset-bottom))] lg:pb-16"
              : "pb-16",
          )}
          style={
            useMobileToolbar
              ? ({
                  "--dashboard-mobile-toolbar-height": DASHBOARD_MOBILE_TOOLBAR_HEIGHT,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div className="mx-auto max-w-5xl animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
