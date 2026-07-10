import { AppSidebar } from "./app-sidebar";
import type { NavSection } from "./dashboard-nav";

type AppShellProps = {
  children: React.ReactNode;
  user: { name: string; email: string };
  sections: NavSection[];
  brand?: string;
  brandHref?: string;
};

export function AppShell({ children, user, sections, brand, brandHref }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar sections={sections} user={user} brand={brand} brandHref={brandHref} />
      <main className="lg:mr-64">
        <div className="min-h-screen px-6 pb-12 pt-20 lg:pt-8">
          <div className="mx-auto max-w-5xl animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
