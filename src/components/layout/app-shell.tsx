import { AppSidebar } from "./app-sidebar";
import type { NavSection } from "./dashboard-nav";

type AppShellProps = {
  children: React.ReactNode;
  user: { name: string; phoneNumber?: string | null; email?: string | null };
  sections: NavSection[];
  brand?: string;
  brandHref?: string;
};

export function AppShell({ children, user, sections, brand, brandHref }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Warm wash behind the top of every page, fading into the plain background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-brand-50 to-transparent"
      />
      <AppSidebar sections={sections} user={user} brand={brand} brandHref={brandHref} />
      <main className="relative lg:mr-64">
        <div className="min-h-screen px-5 pb-16 pt-24 sm:px-8 lg:pt-10">
          <div className="mx-auto max-w-5xl animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
